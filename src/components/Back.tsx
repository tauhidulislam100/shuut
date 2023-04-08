import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeftCircle } from "react-icons/bs";

const Back = ({ border = true }) => {
  const router = useRouter();
  return (
    <div
      className={`bg-[#F8FAFC] bg-opacity-30 py-8 ${
        border ? "border-t border-[#D0CFD8] border-opacity-30" : ""
      }`}
    >
      <div className="container">
        <button
          onClick={() => router.back()}
          className="text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center"
        >
          <span className="mr-2 text-secondary">
            <BsArrowLeftCircle />
          </span>
          back
        </button>
      </div>
    </div>
  );
};

export default Back;
