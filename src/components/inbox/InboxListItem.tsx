import { Avatar, Grid } from "antd";
import { format } from "date-fns";
import { RiDeleteBinFill } from "react-icons/ri";
import { IUser } from "../../contexts/AuthProvider";
import { InboxType } from "../../contexts/GlobalStateProvider";
import { useGlobalState } from "../../hooks/useGlobalState";
import { getSender, sortByDateString } from "../../utils/utils";

const { useBreakpoint } = Grid;

const InboxListItem = ({
  selected,
  inbox,
  user,
  canSelectMulitple,
  onDelete,
}: {
  selected?: boolean;
  inbox?: InboxType;
  user: IUser | null;
  canSelectMulitple?: boolean;
  onDelete?: () => void;
}) => {
  const { messages } = useGlobalState();
  const screen = useBreakpoint();
  const sender = getSender(inbox, user);

  const _messages = sortByDateString(
    messages?.filter((msg) => msg.inbox_id === inbox?.id)
  );
  const undread = _messages.filter(
    (msg) => msg.sender.id !== user?.id && !msg.receiver_has_read
  ).length;

  return (
    <div
      className={`group flex items-start cursor-pointer lg:p-2 md:pr-0 p-2 xxs:px-0 rounded-[4px] ${
        selected ? "bg-[#090F4730]" : ""
      }`}
    >
      {!canSelectMulitple ? (
        <button
          onClick={onDelete}
          className="mr-1 self-center group-hover:block hidden"
        >
          <RiDeleteBinFill className="w-full text-xl cursor-pointer text-red-500" />
        </button>
      ) : null}
      <Avatar
        size={!screen.lg ? 40 : 50}
        src={sender?.profile_photo}
        className="!bg-[#090F47]"
      >
        {`${sender?.firstName?.charAt(0)}${sender?.lastName?.charAt(
          0
        )}`.toUpperCase()}
      </Avatar>
      <div className="lg:ml-4 md:ml-2 sm:ml-4 ml-2 w-[calc(100%-66px)]">
        <div className="flex justify-between">
          <h1
            className={`font-bold font-sofia-pro lg:text-base sm:text-base md:text-xs text-sm ${
              selected ? "text-[#090F47]" : "text-[#0C0D0C]"
            }`}
          >
            {sender?.firstName} {sender?.lastName}
          </h1>
          <p
            className={`text-xs font-sofia-pro  ${
              selected ? "text-[#090F47]" : "text-[#0A242980]"
            }`}
          >
            {format(
              _messages?.[_messages?.length - 1]?.created_at
                ? new Date(_messages?.[_messages?.length - 1]?.created_at)
                : new Date(),
              "MMM dd yyyy, hh:mm"
            )}
          </p>
        </div>
        <p
          className={`text-sm font-sofia-pro mb-0  ${
            selected ? "text-[#090F47]" : "text-[#0A2429] text-opacity-50"
          }`}
        >
          {_messages?.[_messages?.length - 1]?.content ??
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
