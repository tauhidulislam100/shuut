const OutlinedButton = ({
  children,
  isActive = false,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px]  rounded-md font-lota ${
        isActive
          ? "text-secondary border-secondary"
          : "border-[#D0CFD84D] text-primary"
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default OutlinedButton;
