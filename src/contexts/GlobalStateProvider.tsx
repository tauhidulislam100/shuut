import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import React, { useEffect, useState } from "react";
import useAsyncEffect from "use-async-effect";
import {
  GET_FAVORITES,
  GET_MY_INBOXES,
  MARK_MESSAGE_AS_READ,
  MY_INBOXES_SUBSCRIPTION_STREAM,
  MY_MESSAGES,
  MY_MESSAGES_SUBSCRIPTION,
} from "../graphql/query_mutations";
import { useAuth } from "../hooks/useAuth";
import { groupBy, sortBy, unionBy } from "lodash";
import { format } from "date-fns";
import { mergeUnionByKey } from "../utils/utils";
import { notification } from "antd";

interface IProps {
  children: React.ReactNode;
}

export interface IMessageUser {
  id: number;
  firstName: string;
  lastName: string;
  profile_photo: string;
}
export interface IMessage {
  id: number;
  inbox_id: number;
  sender: IMessageUser;
  content: string;
  receiver_has_read: boolean;
  created_at: string;
  updated_at?: string;
  month: string;
}

export interface InboxType {
  id: number;
  from: IMessageUser;
  to: IMessageUser;
  messages: IMessage[];
  created_at: string;
}

export type StateType = {
  SERVICE_CHARGE: number;
  SERVICE_VAT: number;
  inboxes: InboxType[];
  inboxesLoading: boolean;
  messagesLoading: boolean;
  favorites: Record<string, any>[];
  fetchMoreInboxes?: () => Promise<void>;
  fetchMoreMessages?: () => Promise<void>;
  updateSelectedInbox?: (inbx?: InboxType) => void;
  removeInboxes?: (ids: number[]) => void;
  markMessageAsRead?: (inbx?: InboxType) => Promise<void>;
  updateFavorites?: () => Promise<void>;
};

const initalState: StateType = {
  SERVICE_CHARGE: 0,
  SERVICE_VAT: 0,
  inboxes: [],
  inboxesLoading: false,
  messagesLoading: false,
  favorites: [],
};

const SERVICE_CHARGE = Number(process.env.NEXT_PUBLIC_SERVICE_CHARGE);
const SERVICE_VAT = Number(process.env.NEXT_PUBLIC_SERVICE_VAT);

let inboxPageSize = 10;
let inboxPage = 0;
let messagePageSize = 10;
// inboxId:currentPage
const messagePagination: Record<number, number> = {};

export const GlobalContext = React.createContext(initalState);

const GlobalStateProvider = ({ children }: IProps) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Record<string, any>[]>([]);
  const [selectedInbox, setSelectedInbox] = useState<InboxType>();
  let [inboxes, setInboxes] = useState<InboxType[]>([]);
  const [latestInboxes, setLatestInboxes] = useState<InboxType[]>([]);
  const [messagesByInbox, setMessagesByInbox] = useState<
    Record<number, IMessage[]>
  >({});

  const [getFavorites, { refetch: reFetchFavorites }] = useLazyQuery(
    GET_FAVORITES,
    {
      onCompleted(data) {
        setFavorites(data.favorite);
      },
    }
  );
  const [markMessageAsRead] = useMutation(MARK_MESSAGE_AS_READ, {
    onError(error) {
      console.log(error?.message);
    },
  });

  const [
    getMyInboxes,
    { fetchMore: fetchMoreInboxes, data: inboxesData, loading: inboxesLoading },
  ] = useLazyQuery(GET_MY_INBOXES, {
    onError(error) {
      console.log(error.message);
    },
  });

  const [
    fetchMyMessages,
    {
      fetchMore: fetchMoreMessages,
      data: messagesData,
      loading: messagesLoading,
    },
  ] = useLazyQuery(MY_MESSAGES, {
    onError(error) {
      console.log("myMessage", error.message);
    },
  });

  const { data: inboxesStream } = useSubscription(
    MY_INBOXES_SUBSCRIPTION_STREAM,
    {
      variables: {
        userId: user?.id,
        createdAt: format(new Date(), "yyyy-MM-dd"),
      },
    }
  );
  const { data: messagesStream } = useSubscription(MY_MESSAGES_SUBSCRIPTION, {
    variables: {
      userId: user?.id,
    },
    onError(error) {
      if (user) {
        notification.error({
          message: error.message,
        });
      }
    },
  });

  useAsyncEffect(
    async (isMounted) => {
      if (isMounted() && user?.id) {
        await getMyInboxes({
          variables: {
            userId: user.id,
            limit: inboxPageSize,
            offset: 0,
          },
        });
        await getFavorites({
          variables: {
            userId: user?.id,
          },
        });
      }
    },
    [user?.id]
  );

  useEffect(() => {
    //init myMessages query this query will throw an error
    fetchMyMessages({
      variables: {
        inbox_id: 0,
        limit: 0,
        offset: 0,
      },
    });
  }, []);

  //merging websocket and http data
  useEffect(() => {
    if (inboxesData) {
      setInboxes([...(unionBy(inboxesData.inbox, latestInboxes, "id") as any)]);
    }
  }, [inboxesData, latestInboxes]);

  //if new inbox created then data received by websocket
  useEffect(() => {
    if (inboxesStream?.inbox_stream) {
      setLatestInboxes((p) => [...p, ...inboxesStream.inbox_stream]);
    }
  }, [inboxesStream]);

  useEffect(() => {
    if (messagesStream?.messages) {
      setMessagesByInbox((prev) => {
        const msgGroup = groupBy(messagesStream?.messages, "inbox_id");
        for (let key in msgGroup) {
          if (prev[key as unknown as number]) {
            prev[key as unknown as number] = [
              ...prev[key as unknown as number],
              ...msgGroup[key],
            ];
          } else {
            prev[key as unknown as number] = msgGroup[key];
          }
        }
        return { ...prev };
      });
    }
  }, [messagesStream]);

  useEffect(() => {
    if (selectedInbox && messagesData) {
      setMessagesByInbox((p) => {
        p[selectedInbox.id] = [
          ...(p[selectedInbox.id] ?? []),
          ...messagesData.my_messages,
        ];
        return { ...p };
      });
    }
  }, [selectedInbox, messagesData]);

  useEffect(() => {
    if (messagesByInbox && Object.keys(messagesByInbox).length) {
      //updating messages as read
      setInboxes((prev) => {
        return [...combineMessagesWithInbox(prev, messagesByInbox)];
      });
    }
  }, [messagesByInbox]);

  const onFetchMoreInboxes = async () => {
    inboxPage += 1;
    const offset = inboxPage * inboxPageSize;
    //this check will prevent unnecessary queries if there is no data left
    if (
      inboxesData?.inbox_aggregate?.aggregate?.total &&
      inboxPage >=
        Math.round(
          inboxesData.inbox_aggregate?.aggregate?.total / inboxPageSize
        )
    ) {
      return;
    }
    await fetchMoreInboxes({
      variables: {
        userId: user?.id,
        limit: inboxPageSize,
        offset: offset,
      },
      updateQuery(existing, incoming) {
        return {
          inbox: [...existing.inbox, ...incoming.fetchMoreResult.inbox],
        };
      },
    });
  };

  const onFetchMoreMessages = async () => {
    if (!selectedInbox?.id) return;
    messagePagination[selectedInbox?.id] =
      (messagePagination[selectedInbox?.id] ?? 0) + 1;
    const msgPage = messagePagination[selectedInbox?.id];
    const offset = msgPage * messagePageSize;
    //this check will prevent unnecessary queries if there is no data left
    if (
      messagesData?.my_messages_info?.aggregate?.total &&
      msgPage >=
        Math.round(
          messagesData.my_messages_info?.aggregate?.total / messagePageSize
        )
    ) {
      return;
    }
    const variables = {
      limit: messagePageSize,
      offset: offset,
      inbox_id: selectedInbox.id,
    };

    await fetchMoreMessages({
      variables: {
        ...variables,
      },
      updateQuery(existing, incoming) {
        return {
          my_messages: [
            ...(existing.my_messages ?? []),
            ...incoming.fetchMoreResult.my_messages,
          ],
          my_messages_info: {
            ...incoming.fetchMoreResult?.my_messages_info,
            aggregate: {
              ...incoming.fetchMoreResult?.my_messages_info?.aggregate,
            },
          },
        };
      },
    });
  };

  function combineMessagesWithInbox(
    inboxes: InboxType[],
    messagesByInbox: Record<number, IMessage[]>
  ) {
    for (const index in inboxes) {
      let inbox = { ...inboxes[index], messages: [...inboxes[index].messages] };
      if (messagesByInbox?.[inbox.id]) {
        inboxes[index] = {
          ...inbox,
          messages: [
            ...mergeUnionByKey(
              inbox.messages,
              messagesByInbox?.[inbox.id],
              "id"
            ),
          ] as IMessage[],
        };
      }

      inboxes[index] = {
        ...inboxes[index],
        messages: [...sortBy(inboxes[index].messages, (m) => m.created_at)],
      };
    }
    return [
      // ...sortBy(inboxes, (inb) => {
      //   const r = inb?.messages?.length
      //     ? Date.parse(inb.messages[inb.messages.length - 1].created_at) >
      //       Date.parse(inb.created_at)
      //       ? inb.messages[inb.messages.length - 1].created_at
      //       : inb.created_at
      //     : inb.created_at;
      //   return Date.parse(r);
      // }),
      ...inboxes,
    ];
  }

  function removeInboxes(inboxIds: number[]) {
    setInboxes((inbx) => {
      return [...inbx.filter((item) => !inboxIds.includes(item.id))];
    });
  }

  const onMarkMessageAsRead = async (inbx?: InboxType) => {
    if (inbx && !selectedInbox && !user) return;
    await markMessageAsRead({
      variables: {
        inboxId: selectedInbox?.id ?? inbx?.id,
        userId: user?.id,
      },
    });
  };

  const updateFavorites = async () => {
    await reFetchFavorites({
      userId: user?.id,
    });
  };

  return (
    <GlobalContext.Provider
      value={{
        SERVICE_CHARGE,
        SERVICE_VAT,
        inboxes: inboxes,
        inboxesLoading,
        messagesLoading,
        favorites,
        fetchMoreInboxes: onFetchMoreInboxes,
        fetchMoreMessages: onFetchMoreMessages,
        updateSelectedInbox: setSelectedInbox,
        removeInboxes: removeInboxes,
        markMessageAsRead: onMarkMessageAsRead,
        updateFavorites: updateFavorites,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalStateProvider;
