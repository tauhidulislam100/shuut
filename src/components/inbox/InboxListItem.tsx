import { Avatar } from "antd";
import { format } from "date-fns";
import { IUser } from "../../contexts/AuthProvider";
import { InboxType } from "../../contexts/GlobalStateProvider";
import { getSender } from "../../utils/utils";

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

  const undread = inbox?.messages?.filter(
    (msg) => msg.sender.id !== user?.id && !msg.receiver_has_read
  ).length;

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
          className={`hidden sm:block text-sm font-sofia-pro mb-0  ${
            selected ? "text-[#090F47]" : "text-[#0A2429] text-opacity-50"
          }`}
        >
          {inbox?.messages?.[inbox?.messages?.length - 1]?.content ??
            "You can now send message to each other"}
        </p>
      </div>
      {undread ? (
        <span className="w-7 h-7 rounded-full bg-primary text-white grid place-items-center font-bold font-sofia-pro text-base absolute right-3 top-8">
          {undread}
        </span>
      ) : null}
    </div>
  );
};

export default InboxListItem;
