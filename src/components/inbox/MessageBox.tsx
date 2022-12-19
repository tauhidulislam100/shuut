import { Avatar, Grid, Spin } from "antd";
import { format } from "date-fns";
import React, { useEffect, useRef } from "react";
import { IMessage, InboxType } from "../../contexts/GlobalStateProvider";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
const { useBreakpoint } = Grid;

const MessageBox = ({
  messages,
  selectedInbox,
  updateScrollPosition,
}: {
  messages: Record<string, IMessage[]>;
  selectedInbox?: InboxType;
  updateScrollPosition?: (n?: number) => void;
}) => {
  const screen = useBreakpoint();
  const ref = useRef<number | null>(null);
  const { user } = useAuth();
  const { messagesLoading, fetchMoreMessages } = useGlobalState();

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    const handleScroll = async () => {
      if (messageContainer && messageContainer.scrollTop <= 0) {
        await fetchMoreMessages?.();
        updateScrollPosition?.(30);
      }
    };
    messageContainer?.addEventListener("scroll", handleScroll, false);
    if (
      selectedInbox?.id &&
      ref.current !== selectedInbox?.id &&
      messageContainer
    ) {
      updateScrollPosition?.();
      ref.current = selectedInbox?.id;
    }
    return () =>
      messageContainer?.removeEventListener("scroll", handleScroll, false);
  }, [selectedInbox, messages, updateScrollPosition, fetchMoreMessages]);

  return (
    <>
      {Object.keys(messages)?.map((key) => (
        <div
          key={key}
          className="overflow-y-auto mb-4 custom-scrollbar pt-8"
          id="message-container"
        >
          {messagesLoading ? (
            <div className="flex justify-center">
              <Spin size="default" />
            </div>
          ) : null}
          <div className="md:px-5">
            <h4 className="mb-5 text-xs font-sofia-pro text-[#0A242980] text-center">
              {format(new Date(key), "MMMM, yyyy")}
            </h4>
            {messages[key]?.map((message) => {
              return message?.sender?.id === user?.id ? (
                <div className="w-full mt-4" key={message?.id}>
                  {/* message left */}
                  <div className="lg:w-4/5 flex">
                    <Avatar
                      size={screen.lg ? 50 : 33}
                      src={message?.sender?.profile_photo}
                      className="!bg-[#090F47]"
                    >
                      {`${message?.sender?.firstName?.charAt(
                        0
                      )}${message?.sender?.lastName?.charAt(0)}`.toUpperCase()}
                    </Avatar>
                    <div className="ml-4">
                      <div className="border rounded-md bg-white">
                        <p className="lg:px-6 lg:py-3 py-2 mb-0 text-primary text-center">
                          {message?.content}
                        </p>
                      </div>
                      <div className="w-full md:mt-4 mt-2 space-x-2 flex justify-end items-center gap-3 md:font-medium md:text-sm text-xs font-sofia-pro">
                        {message?.receiver_has_read ? (
                          <span className="text-[#C4C4C4]">Read</span>
                        ) : null}
                        <span className="inline-block w-3 h-3 rounded-full bg-slate-400"></span>
                        <span className="text-[#FF0200]">Flag</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end mt-4" key={message?.id}>
                  {/* message right */}
                  <div className="lg:w-4/5 flex flex-row-reverse">
                    <Avatar
                      size={screen.lg ? 50 : 33}
                      src={message?.sender?.profile_photo}
                      className="!bg-[#090F47]"
                    >
                      {`${message?.sender?.firstName?.charAt(
                        0
                      )}${message?.sender?.lastName?.charAt(0)}`.toUpperCase()}
                    </Avatar>
                    <div className="mr-4">
                      <div className="border rounded-md bg-primary">
                        <p className="lg:px-6 lg:py-3 px-3 py-2 mb-0 text-center text-white">
                          {message?.content}
                        </p>
                      </div>
                      <div className="w-full md:mt-4 mt-2 space-x-2 flex justify-end items-center gap-3 md:font-medium md:text-sm text-xs font-sofia-pro">
                        <span className="text-[#C4C4C4]">Read</span>
                        <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                        <span className="text-[#FF0200]">Flag</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )) ?? <div className="text-center">You are now connected</div>}
    </>
  );
};

export default MessageBox;
