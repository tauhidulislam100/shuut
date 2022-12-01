import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Form, Radio, Space } from "antd";

const UploadId = ({ handleNext }: { handleNext: () => void }) => {
  return (
    <div className="mt-5">
      <h1 className="text-[32px] font-lota font-semibold text-primary">
        Upload ID
      </h1>
      <p className="font-lota text-lg">
        SHUUT requires a photo of a government ID to verify your identity
      </p>
      <Form className="mt-12">
        <h5 className="">Choose options below:</h5>
        <Radio.Group className="w-full">
          <div className="flex justify-between w-full border border-body-light rounded-[5px] p-5 mt-5">
            <Radio name="id_type" value={"id"} className="">
              <h3 className="font-sofia-pro text-sm text-[#263238]">
                National Identification
              </h3>
            </Radio>
            <div className="ml-auto">
              <MdKeyboardArrowRight className="text-xl text-[#323232]" />
            </div>
          </div>
          <div className="flex justify-between w-full border border-body-light rounded-[5px] p-5 mt-10">
            <Radio name="id_type" value={"licence"} className="">
              <h3 className="font-sofia-pro text-sm text-[#263238]">
                Driver’s Licence
              </h3>
            </Radio>
            <div className="ml-auto">
              <MdKeyboardArrowRight className="text-xl text-[#323232]" />
            </div>
          </div>
          <div className="flex justify-between w-full border border-body-light rounded-[5px] p-5 mt-10">
            <Radio name="id_type" value={"passport"} className="">
              <h3 className="font-sofia-pro text-sm text-[#263238]">
                Passport
              </h3>
            </Radio>
            <div className="ml-auto">
              <MdKeyboardArrowRight className="text-xl text-[#323232]" />
            </div>
          </div>
          <div className="flex justify-between w-full border border-body-light rounded-[5px] p-5 mt-10">
            <Radio name="id_type" value={"rp"} className="">
              <h3 className="font-sofia-pro text-sm text-[#263238]">
                Residence Permit
              </h3>
            </Radio>
            <div className="ml-auto">
              <MdKeyboardArrowRight className="text-xl text-[#323232]" />
            </div>
          </div>
        </Radio.Group>
        <div className="mt-12 flex justify-end gap-5">
          <button
            onClick={() => console.log("Button!")}
            className="w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            className="w-[193px] hover:bg-primary font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold"
          >
            Next
          </button>
        </div>
      </Form>
    </div>
  );
};

export default UploadId;
