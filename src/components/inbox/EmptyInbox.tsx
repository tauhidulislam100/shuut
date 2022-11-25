const EmptyInbox = ({ onClick }: { onClick?: () => void }) => (
  <div className="min-h-[74.5vh]">
    <div className="mt-20">
      <h1 className="text-primary text-[32px] font-semibold">Message</h1>
    </div>
    <div className="py-10 flex justify-center items-center">
      <img
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

export default EmptyInbox;
