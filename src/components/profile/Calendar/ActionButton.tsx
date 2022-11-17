import { BiPlusCircle } from "react-icons/bi";

const ActionButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      className="bg-transparent text-secondary"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick?.();
      }}
    >
      <BiPlusCircle />
    </button>
  );
};

export default ActionButton;
