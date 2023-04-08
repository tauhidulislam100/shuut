import React from "react";
import { Form, Radio } from "antd";
import { useRouter } from "next/router";

const LastStep = () => {
  const router = useRouter();
  return (
    <div className="mt-5">
      <h1 className="text-[32px] font-lota font-semibold text-primary">
        What’s Next?
      </h1>
      <Form className="mt-12">
        <Radio.Group className="w-full">
          <div className="flex justify-between w-full border border-body-light rounded-[5px] p-5 mt-5">
            <h3 className="font-sofia-pro text-sm text-[#263238]">
              SHUUT reviews document and rental details
            </h3>
          </div>
          <div className="flex justify-between w-full border border-body-light rounded-[5px] p-5 mt-5">
            <h3 className="font-sofia-pro text-sm text-[#263238]">
              Once verified, your request is passed on to the lender.
            </h3>
          </div>
          <div className="flex justify-between w-full border border-body-light rounded-[5px] p-5 mt-5">
            <h3 className="font-sofia-pro text-sm text-[#263238]">
              Lender accepts your request
            </h3>
          </div>
          <div className="flex justify-between w-full border border-body-light rounded-[5px] p-5 mt-5">
            <h3 className="font-sofia-pro text-sm text-[#263238]">
              Talk to the lender to arrange handover
            </h3>
          </div>
          <div className="flex justify-between w-full border border-body-light rounded-[5px] p-5 mt-5">
            <h3 className="font-sofia-pro text-sm text-[#263238]">
              Enjoy your rental
            </h3>
          </div>
        </Radio.Group>
        <div className="mt-12 flex justify-end gap-5">
          <button
            onClick={() => router.push("/profile?tab=rentals")}
            className="w-[193px] hover:bg-primary font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold"
          >
            Go To Rentals
          </button>
        </div>
      </Form>
    </div>
  );
};

export default LastStep;
