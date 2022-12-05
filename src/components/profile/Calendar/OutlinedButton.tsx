const OutlinedButton = ({
  children,
  isActive = false,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px]  rounded-md font-lota ${
        isActive
          ? "text-secondary border-secondary"
          : "border-[#D0CFD84D] text-primary"
      }`}
    >
      {children}
    </button>
  );
};

export default OutlinedButton;
