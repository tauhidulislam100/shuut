import { Select } from "antd";
import React from "react";
import { countryList } from "../../data";

const { Option } = Select;

const IdFrom = ({ handleNext }: { handleNext: () => void }) => {
  return (
    <div className="mt-5">
      <h1 className="text-[32px] font-lota font-semibold text-primary">
        What Country Is Your Government ID From?
      </h1>
      <p className="font-lota text-lg">
        SHUUT requires a photo of a government ID to verify your identity.
      </p>
      <div className="mt-12">
        <h4 className="mb-5">Choose options below:</h4>
        <Select className="choose-country" placeholder="Select A Country">
          {countryList.map((country) => (
            <Option key={country} value={country}>
              {country}
            </Option>
          ))}
        </Select>
      </div>
      <div className="my-6 grid grid-cols-2 gap-5">
        {/* <div className="border border-dashed rounded-lg h-32 cursor-pointer grid place-items-center">
          <p>Document Front</p>
        </div>
        <div className="border border-dashed rounded-lg h-32 cursor-pointer grid place-items-center">
          <p>Document Back</p>
        </div> */}
      </div>
      <div className="">
        <h1 className="text-primary text-[32px] font-lota font-semibold">
          Complete Identity Check
        </h1>
        <p className="text-lg font-lota mt-5">
          You will have the option to use the camera on your phone when needed.
        </p>
        <div className="border rounded-[5px] mt-10 bg-[#FCFCFD] font-lota">
          <p className="p-8">
            You will have the option to use the camera on your phone when
            needed. By clicking the button below, you’re aggreing to the{" "}
            <span className="text-secondary"> privacy policy of</span> SHUUT,
            your biometric information, will be stored for more than 3 years.
          </p>
        </div>
        <div className="mt-12 flex justify-end gap-5">
          <button
            onClick={handleNext}
            className="w-[193px] font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold"
          >
            Start Identity Check
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdFrom;
