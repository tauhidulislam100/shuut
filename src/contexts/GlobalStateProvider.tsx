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
import { unionBy } from "lodash";
import { format } from "date-fns";
import { notification } from "antd";

function removeDuplicateMessages(messages: IMessage[]): IMessage[] {
  const uniqueMessages = new Map<number, IMessage>();

  messages.forEach((message) => {
    if (!uniqueMessages.has(message.id)) {
      uniqueMessages.set(message.id, message);
    } else if (message.receiver_has_read) {
      uniqueMessages.set(message.id, message);
    }
  });

  return Array.from(uniqueMessages.values());
}

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
  messages: IMessage[];
  inboxesLoading: boolean;
  messagesLoading: boolean;
  favorites: Record<string, any>[];
  checkoutItems: number[];
  fetchMoreInboxes?: () => Promise<void>;
  fetchMoreMessages?: () => Promise<void>;
  updateSelectedInbox?: (inbx?: InboxType) => void;
  removeInboxes?: (ids: number[]) => void;
  markMessageAsRead?: (inbx?: InboxType) => Promise<void>;
  updateFavorites?: () => Promise<void>;
  updateCheckoutItems?: (id?: number, all?: number[]) => void;
};

const initalState: StateType = {
  SERVICE_CHARGE: 0,
  SERVICE_VAT: 0,
  inboxes: [],
  messages: [],
  inboxesLoading: false,
  messagesLoading: false,
  favorites: [],
  checkoutItems: [],
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
  const [checkoutItems, setCheckoutItems] = useState<number[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);

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
    { fetchMore: fetchMoreInboxes, loading: inboxesLoading, data: inboxesData },
  ] = useLazyQuery(GET_MY_INBOXES, {
    onCompleted(data) {
      setInboxes((prev) => [...(unionBy(prev, data.inbox, "id") as any)]);
    },
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

  useSubscription(MY_INBOXES_SUBSCRIPTION_STREAM, {
    onData({ data: { data } }) {
      console.log(data);
      if (data.inbox_stream) {
        setInboxes((prev) => [
          ...(unionBy(prev, data.inbox_stream, "id") as any),
        ]);
      }
    },
    variables: {
      userId: user?.id,
      createdAt: format(new Date(), "yyyy-MM-dd"),
    },
  });

  useSubscription(MY_MESSAGES_SUBSCRIPTION, {
    variables: {
      userId: user?.id,
    },
    onData({ data: { data } }) {
      if (data?.messages) {
        setMessages((prev) =>
          removeDuplicateMessages([...prev, ...data.messages])
        );
      }
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

  useEffect(() => {
    if (selectedInbox && messagesData) {
      setMessages((prev) =>
        removeDuplicateMessages([...prev, ...messagesData?.my_messages])
      );
    }
  }, [selectedInbox, messagesData]);

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

  const updateCheckoutItems = (id?: number, all?: any) => {
    if (all) {
      return setCheckoutItems([...all]);
    }
    if (checkoutItems.includes(id as number)) {
      setCheckoutItems([...checkoutItems.filter((_id) => _id !== id)]);
    } else {
      setCheckoutItems([...checkoutItems, id as number]);
    }
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
        checkoutItems,
        messages,
        fetchMoreInboxes: onFetchMoreInboxes,
        fetchMoreMessages: onFetchMoreMessages,
        updateSelectedInbox: setSelectedInbox,
        markMessageAsRead: onMarkMessageAsRead,
        removeInboxes,
        updateFavorites,
        updateCheckoutItems,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalStateProvider;
