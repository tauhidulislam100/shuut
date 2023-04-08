import { Spin } from "antd";
import { useEffect, useRef } from "react";
import { InboxType } from "../../contexts/GlobalStateProvider";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import InboxListItem from "./InboxListItem";

interface IProps {
  selectedInbox?: InboxType;
  selectedInboxes: number[];
  canSelectMulitple: boolean;
  onDelete?: (id: number) => void;
  updateMultipleSelection?: React.Dispatch<React.SetStateAction<any>>;
  updateSelectedInbox: (inb: InboxType) => void;
}
const InboxSidebar = ({
  selectedInbox,
  selectedInboxes,
  canSelectMulitple,
  onDelete,
  updateMultipleSelection,
  updateSelectedInbox,
}: IProps) => {
  const sensorRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const { inboxes, fetchMoreInboxes, inboxesLoading } = useGlobalState();

  useEffect(() => {
    async function handleInfinteScroll() {
      const el = sensorRef.current;
      //reached scroll bottom
      if (el && el.offsetHeight + el.scrollTop === el.scrollHeight) {
        await fetchMoreInboxes?.();
      }
    }
    const el = sensorRef.current;
    el?.addEventListener("scroll", handleInfinteScroll);
    return () => el?.removeEventListener("scroll", handleInfinteScroll);
  }, [fetchMoreInboxes]);

  return (
    <div
      className="md:w-2/5 w-full md:pr-4 overflow-y-auto custom-scrollbar"
      ref={sensorRef}
    >
      {inboxes?.map((inbox) => (
        <div
          className="mt-4 relative"
          key={inbox.id}
          onClick={() => {
            if (canSelectMulitple) {
              updateMultipleSelection?.((p: any) => {
                if (!p.includes(inbox.id)) {
                  return [...p, inbox.id];
                } else {
                  return [...p.filter((item: any) => item !== inbox.id)];
                }
              });
            } else {
              updateSelectedInbox?.(inbox);
            }
          }}
        >
          <InboxListItem
            inbox={inbox}
            user={user}
            selected={
              selectedInbox?.id === inbox.id ||
              selectedInboxes?.includes(inbox.id)
            }
            onDelete={() => onDelete?.(inbox.id)}
            canSelectMulitple={canSelectMulitple}
          />
        </div>
      ))}
      {inboxesLoading ? (
        <div className="flex justify-center">
          <Spin size="default" />
        </div>
      ) : null}
    </div>
  );
};

export default InboxSidebar;
