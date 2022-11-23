import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BsArrowLeftCircle } from "react-icons/bs";
import { RiDeleteBinFill } from "react-icons/ri";
import { groupBy } from "lodash";
import { Footer, NavBar } from "../components";
import { Avatar, Button, Input, notification } from "antd";
import { useRouter } from "next/router";
import AuthGuard from "../components/auth-guard/AuthGuard";
import { useGlobalState } from "../hooks/useGlobalState";
import { useAuth } from "../hooks/useAuth";
import { format } from "date-fns";
import { IMessage, InboxType } from "../contexts/GlobalStateProvider";
import { useMutation } from "@apollo/client";
import {
  CREATE_INBOX,
  DELETE_INBOXES,
  MARK_MESSAGE_AS_READ,
  SEND_MESSAGE,
} from "../graphql/query_mutations";
import useAsyncEffect from "use-async-effect";
import { IUser } from "../contexts/AuthProvider";

const EmptyInbox = ({ onClick }: { onClick?: () => void }) => (
  <div className="min-h-[74.5vh]">
    <div className="mt-20">
      <h1 className="text-primary text-[32px] font-semibold">Message</h1>
    </div>
    <div className="py-10 flex justify-center items-center">
      <Image
        src={"/images/no_message.png"}
        alt="Profile Image"
        width={571}
        height={365}
      />
    </div>
    <div className="flex justify-center mt-[60px]">
      <button
        onClick={onClick}
        className=" bg-secondary hover:bg-primary  h-[48px] w-[193px] text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg"
      >
        Go Home
      </button>
    </div>
  </div>
);

const InboxListItem = ({
  selected,
  inbox,
  user,
}: {
  selected?: boolean;
  inbox?: InboxType;
  user: IUser | null;
}) => {
  const sender = getSender(inbox, user);
  return (
    <div
      className={`flex items-start cursor-pointer p-2 rounded-[4px] ${
        selected ? "bg-[#090F4730]" : ""
      }`}
    >
      <Avatar size={50} src={sender?.profile_photo} className="!bg-[#090F47]">
        {`${sender?.firstName?.charAt(0)}${sender?.lastName?.charAt(
          0
        )}`.toUpperCase()}
      </Avatar>
      <div className="ml-4 w-[calc(100%-66px)]">
        <div className="flex justify-between">
          <h1
            className={`font-bold font-sofia-pro text-base ${
              selected ? "text-[#090F47]" : "text-[#0C0D0C]"
            }`}
          >
            {sender?.firstName} {sender?.lastName}
          </h1>
          <p
            className={`hidden sm:block text-xs font-sofia-pro  ${
              selected ? "text-[#090F47]" : "text-[#0A242980]"
            }`}
          >
            {format(
              inbox?.messages?.[inbox?.messages?.length - 1]?.created_at
                ? new Date(
                    inbox?.messages?.[inbox?.messages?.length - 1]?.created_at
                  )
                : new Date(),
              "MMMM yyyy"
            )}
          </p>
        </div>
        <p
          className={`hidden sm:block text-sm font-sofia-pro  ${
            selected ? "text-[#090F47]" : "text-[#0A2429] text-opacity-50"
          }`}
        >
          {inbox?.messages?.[inbox?.messages?.length - 1]?.content ??
            "You can now send message to each other"}
        </p>
      </div>
      {inbox?.messages?.filter(
        (m) => !m.receiver_has_read && m.sender?.id !== user?.id
      )?.length ? (
        <span className="w-7 h-7 rounded-full bg-primary text-white grid place-items-center font-bold font-sofia-pro text-base absolute right-3 top-8">
          {
            inbox?.messages?.filter(
              (m) => !m.receiver_has_read && m.sender?.id !== user?.id
            )?.length
          }
        </span>
      ) : null}
    </div>
  );
};

const getSender = (
  inbox?: InboxType,
  currentUser?: Record<string, any> | null
) => {
  if (inbox?.from?.id !== currentUser?.id) {
    return inbox?.from;
  }

  return inbox?.to;
};

const Message = () => {
  const router = useRouter();
  const trackUserRef = useRef<number>();

  const { user } = useAuth();
  const { inboxes } = useGlobalState();
  const [selectedInbox, setSelectedInbox] = useState<InboxType>();
  const [messages, setMessages] = useState<Record<string, IMessage[]>>({});
  const [msgText, setMsgText] = useState<string>();
  const [creatingInbox, setCreatingInbox] = useState(false);
  const [canSelectInboxes, setCanSelectInboxes] = useState(false);
  const [selectedInboxes, setSelectedInboxes] = useState<number[]>([]);

  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE, {
    onError(error) {
      notification.error({
        message: error?.message,
      });
    },
    onCompleted() {},
  });

  const [createInbox] = useMutation(CREATE_INBOX, {
    onError(error) {
      notification.error({
        message: error?.message,
      });
      setCreatingInbox(false);
    },
    onCompleted(data) {
      setSelectedInbox(data?.inbox);
      setCreatingInbox(false);
    },
  });

  const [markMessageAsRead] = useMutation(MARK_MESSAGE_AS_READ, {
    onError(error) {
      console.log(error?.message);
    },
  });

  const [deleteInboxes] = useMutation(DELETE_INBOXES, {
    onCompleted() {
      notification.success({
        message: "successfully deleted inboxes",
      });
      setSelectedInboxes([]);
    },
    onError(error) {
      notification.error({
        message: error.message,
      });
    },
  });

  useAsyncEffect(async () => {
    if (
      selectedInbox &&
      inboxes &&
      inboxes.find((inb) => inb.id === selectedInbox?.id)
    ) {
      const msg = inboxes.find((inb) => inb.id === selectedInbox?.id)?.messages;
      console.log(
        "groupBy ",
        groupBy(msg, (k) => k.created_at.substring(0, 7))
      );

      setMessages({ ...groupBy(msg, (k) => k.created_at.substring(0, 7)) });
    }

    updateScroll();
    await onMarkMessageAsRead();
  }, [inboxes, selectedInbox]);

  useAsyncEffect(async () => {
    // this will select a inbox or create new inbox if already does not exist
    if (router?.query?.userId) {
      const userId = +router?.query?.userId;
      const inbox = inboxes?.find(
        (inbox) => inbox.from.id === userId || inbox.to.id === userId
      );
      if (inbox) {
        setSelectedInbox(inbox);
      } else if (trackUserRef.current !== userId) {
        setCreatingInbox(true);
        trackUserRef.current = userId;
        await createInbox({
          variables: {
            from: user?.id,
            to: userId,
          },
        });
      }
    }
  }, [router?.query?.userId]);

  const onSendMessage = async () => {
    const k = format(new Date(), "yyyy-MM");
    if (messages[k]) {
      messages[k].push({
        content: msgText,
        id: Date.now(),
        sender: user,
      } as any);
    } else {
      messages[k] = [{ content: msgText, id: Date.now(), sender: user } as any];
    }
    setMessages({ ...messages });
    updateScroll();
    await sendMessage({
      variables: {
        sender: user?.id,
        inboxId: selectedInbox?.id,
        message: msgText,
      },
    });
    setMsgText("");
  };

  const onMarkMessageAsRead = async () => {
    if (!selectedInbox || !user) return;
    await markMessageAsRead({
      variables: {
        inboxId: selectedInbox.id,
        userId: user.id,
      },
    });
  };

  const onDeleteInboxes = async () => {
    if (!canSelectInboxes) return;
    await deleteInboxes({
      variables: {
        inboxes: selectedInboxes,
      },
    });
    setCanSelectInboxes(false);
  };

  function updateScroll() {
    var element = document.getElementById("message-container");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  return (
    <AuthGuard>
      <div className="bg-[#F8FAFC]">
        <NavBar />
        <div className="border-b"></div>
        <main className="container mt-5 pb-10">
          <div className="">
            <button
              onClick={router.back}
              className="text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center mb-20"
            >
              <span className="mr-2 text-secondary">
                <BsArrowLeftCircle />
              </span>
              back
            </button>
          </div>
          {creatingInbox ? (
            <div className="w-full">
              <p className="text-secondary font-medium text-base">
                Connecting...
              </p>
              <div className="bar"></div>
            </div>
          ) : null}
          {inboxes?.length ? (
            <div className="rounded">
              {/* bg-[#FDFCFC] */}
              <div className="sm:flex items-end border-b py-2">
                <div className="w-2/5">
                  <button className="btn border w-40 text-center py-2 cursor-pointer">
                    New Message
                  </button>
                </div>
                <div className="flex-1 flex items-end justify-between">
                  <h3 className="font-lota text-lg text-[#0C0D0C]">
                    {getSender(selectedInbox, user)?.firstName}{" "}
                    {getSender(selectedInbox, user)?.lastName}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Input
                      checked={canSelectInboxes}
                      onChange={(e) => {
                        setCanSelectInboxes(e.target.checked);
                        if (e.target.checked) {
                          setSelectedInbox(undefined);
                        } else {
                          setSelectedInboxes([]);
                        }
                      }}
                      type="checkbox"
                      className="cursor-pointer"
                    />
                    <RiDeleteBinFill
                      onClick={onDeleteInboxes}
                      className="w-full text-xl cursor-pointer text-red-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex max-h-[68vh] min-h-[67vh]">
                <div className="sm:w-2/5 pr-4 overflow-y-auto custom-scrollbar">
                  {inboxes?.map((inbox) => (
                    <div
                      className="mt-4 relative"
                      key={inbox.id}
                      onClick={() => {
                        if (canSelectInboxes) {
                          setSelectedInboxes((p) => {
                            if (!p.includes(inbox.id)) {
                              return [...p, inbox.id];
                            } else {
                              return [...p.filter((item) => item !== inbox.id)];
                            }
                            return [...p];
                          });
                        } else {
                          setSelectedInbox(inbox);
                        }
                      }}
                    >
                      <InboxListItem
                        inbox={inbox}
                        user={user}
                        selected={
                          selectedInbox?.id === inbox.id ||
                          selectedInboxes.includes(inbox.id)
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="flex-1 border-l pt-5 flex flex-col">
                  {selectedInbox ? (
                    <>
                      {Object.keys(messages)?.map((key) => (
                        <div
                          key={key}
                          className="overflow-y-auto mb-4 custom-scrollbar"
                          id="message-container"
                        >
                          <div className="px-5">
                            <h4 className="mb-5 text-xs font-sofia-pro text-[#0A242980] text-center">
                              {format(new Date(key), "MMMM, yyyy")}
                            </h4>
                            {messages[key]?.map((message) => {
                              return message?.sender?.id === user?.id ? (
                                <div className="w-full mt-4" key={message?.id}>
                                  {/* message left */}
                                  <div className="sm:w-4/5 flex">
                                    <Avatar
                                      size={50}
                                      src={message?.sender?.profile_photo}
                                      className="!bg-[#090F47]"
                                    >
                                      {`${message?.sender?.firstName?.charAt(
                                        0
                                      )}${message?.sender?.lastName?.charAt(
                                        0
                                      )}`.toUpperCase()}
                                    </Avatar>
                                    <div className="ml-4">
                                      <div className="border rounded-md bg-white">
                                        <p className="px-6 py-3 text-primary">
                                          {message?.content}
                                        </p>
                                      </div>
                                      <div className="mt-4 space-x-2 flex items-center gap-3 font-medium text-sm font-sofia-pro">
                                        {message?.receiver_has_read ? (
                                          <span className="text-[#C4C4C4]">
                                            Read
                                          </span>
                                        ) : null}
                                        <span className="inline-block w-3 h-3 rounded-full bg-slate-400"></span>
                                        <span className="text-[#FF0200]">
                                          Flag
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="flex justify-end mt-4"
                                  key={message?.id}
                                >
                                  {/* message right */}
                                  <div className="sm:w-4/5 flex flex-row-reverse">
                                    <Avatar
                                      size={50}
                                      src={message?.sender?.profile_photo}
                                      className="!bg-[#090F47]"
                                    >
                                      {`${message?.sender?.firstName?.charAt(
                                        0
                                      )}${message?.sender?.lastName?.charAt(
                                        0
                                      )}`.toUpperCase()}
                                    </Avatar>
                                    <div className="mr-4">
                                      <div className="border rounded-md bg-primary">
                                        <p className="px-6 py-3 text-white">
                                          {message?.content}
                                        </p>
                                      </div>
                                      <div className="w-full mt-4 space-x-2 flex justify-end items-center gap-3 font-medium text-sm font-sofia-pro">
                                        <span className="text-[#C4C4C4]">
                                          Read
                                        </span>
                                        <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                                        <span className="text-[#FF0200]">
                                          Flag
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )) ?? (
                        <div className="text-center">You are now connected</div>
                      )}
                      <div className="border border-l-0 border-[#E6E6E6] bg-white flex justify-end pb-5 pr-5 mt-auto rounded-t-md">
                        <div className="w-full pl-10 flex items-end gap-5 mt-9">
                          <textarea
                            onChange={(e) => setMsgText(e.target.value)}
                            value={msgText}
                            rows={2.5}
                            placeholder="Write a message..."
                            className="w-full align-top border p-4 font-sofia-pro border-secondary rounded-md"
                          />
                          <Button
                            onClick={onSendMessage}
                            disabled={!msgText?.trim().length}
                            className="font-sofia-pro font-medium px-6 rounded-md text-white py-2 bg-secondary text-[10px]"
                            loading={loading}
                          >
                            Send
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      You have not selected any conversation
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <EmptyInbox />
          )}
        </main>
      </div>
    </AuthGuard>
  );
};

export default Message;
