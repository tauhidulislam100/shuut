import React, { useEffect, useRef, useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { RiDeleteBinFill } from "react-icons/ri";
import { groupBy } from "lodash";
import { NavBar } from "../components";
import { Button, Input, notification, Grid } from "antd";
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
  SEND_MESSAGE,
} from "../graphql/query_mutations";
import useAsyncEffect from "use-async-effect";
import { EmptyInbox, InboxSidebar, MessageBox } from "../components/inbox";
import { getSender } from "../utils/utils";

const { useBreakpoint } = Grid;

const Message = () => {
  const screen = useBreakpoint();
  console.log("screen ", screen);
  const router = useRouter();
  const trackUserRef = useRef<number>();

  const { user } = useAuth();
  const { inboxes, updateSelectedInbox, removeInboxes, markMessageAsRead } =
    useGlobalState();
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
      setMessages({ ...groupBy(msg, (k) => k.created_at.substring(0, 7)) });
    }
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

  useEffect(() => {
    updateSelectedInbox?.(selectedInbox);
  }, [selectedInbox, updateSelectedInbox]);

  const onSendMessage = async () => {
    if (!msgText?.trim().length) return;
    const text = msgText;

    const k = format(new Date(), "yyyy-MM");
    if (messages[k]) {
      messages[k].push({
        content: text,
        id: Date.now(),
        sender: user,
        month: format(new Date(), "yyyy-MM"),
      } as any);
    } else {
      messages[k] = [
        {
          content: text,
          id: Date.now(),
          sender: user,
          month: format(new Date(), "yyyy-MM"),
        } as any,
      ];
    }
    setMessages({ ...messages });
    setMsgText("");
    updateScroll();
    await sendMessage({
      variables: {
        sender: user?.id,
        inboxId: selectedInbox?.id,
        message: text,
      },
    });
  };

  const onDeleteInboxes = async () => {
    if (!canSelectInboxes) return;
    removeInboxes?.(selectedInboxes);
    await deleteInboxes({
      variables: {
        inboxes: selectedInboxes,
      },
    });
    setCanSelectInboxes(false);
  };

  function updateScroll(n?: number) {
    var element = document.getElementById("message-container");
    if (element) {
      element.scrollTo({
        behavior: "smooth",
        top: n ? n : element.scrollHeight + 10,
      });
    }
  }

  const handleEnter = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await onSendMessage();
      updateScroll();
    }
  };

  return (
    <AuthGuard>
      <div className="bg-[#F8FAFC]">
        <NavBar />
        <div className="border-b"></div>
        <main className="container mt-5 pb-10">
          <div className="">
            <button
              onClick={router.back}
              className="text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center md:mb-20 mb-16"
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
              <div className="flex flex-col border-b py-2">
                <div className="w-2/5">
                  <button className="btn md:block hidden border w-40 text-center py-2 cursor-pointer mb-2">
                    New Message
                  </button>
                  {selectedInbox ? (
                    <button
                      onClick={() => setSelectedInbox(undefined)}
                      className="text-primary-100 md:hidden font-normal font-sofia-pro text-xs capitalize flex items-center mb-2"
                    >
                      <span className="mr-2 text-secondary">
                        <BsArrowLeftCircle />
                      </span>
                      Inbox
                    </button>
                  ) : (
                    <h4 className="text-lg font-medium text-primary">Inbox</h4>
                  )}
                </div>
                <div className="flex-1 flex items-end justify-between">
                  <h3 className="font-lota text-lg text-[#0C0D0C]">
                    {getSender(selectedInbox, user)?.firstName}{" "}
                    {getSender(selectedInbox, user)?.lastName}
                  </h3>
                  {(!screen.md && !selectedInbox) || screen.md ? (
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
                  ) : null}
                </div>
              </div>
              <div className="flex max-h-[68vh] min-h-[66vh]">
                {(!screen.md && !selectedInbox) || screen.md ? (
                  <InboxSidebar
                    canSelectMulitple={canSelectInboxes}
                    selectedInboxes={selectedInboxes}
                    selectedInbox={selectedInbox}
                    updateSelectedInbox={(inb) => {
                      setSelectedInbox(inb);
                      markMessageAsRead?.(inb);
                    }}
                    updateMultipleSelection={setSelectedInboxes}
                  />
                ) : null}
                {screen.md || selectedInbox ? (
                  <div className="flex-1 md:border-l pt-5 flex flex-col">
                    {selectedInbox ? (
                      <>
                        <MessageBox
                          messages={messages}
                          updateScrollPosition={updateScroll}
                          selectedInbox={selectedInbox}
                        />
                        <div className="border border-l-0 border-[#E6E6E6] bg-white flex justify-end pb-5 md:pr-5 pr-1 mt-auto rounded-t-md">
                          <div className="w-full md:pl-10 pl-2 flex items-end flex-col md:flex-row gap-5 md:mt-9 mt-2">
                            <textarea
                              onKeyDown={handleEnter}
                              onFocus={() => {
                                markMessageAsRead?.();
                              }}
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
                ) : null}
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
