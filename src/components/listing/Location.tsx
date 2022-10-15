import React, { useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { BiCurrentLocation } from "react-icons/bi";
import { Checkbox, Radio, Space } from "antd";

const Location = ({
  onSubmit,
  onCancel,
  onChange,
  isInvalid,
  data,
}: {
  onSubmit: () => void;
  onCancel: () => void;
  onChange?: (name: string, value: any) => void;
  data: Record<string, any>;
  isInvalid?: boolean;
}) => {
  const findLocation = () => {
    window.navigator.geolocation.getCurrentPosition((pos) => console.log(pos));
  };

  console.log("data ", data);
  return (
    <div className="">
      <h3 className="">Enter Location</h3>
      <div
        onClick={findLocation}
        className="mt-5 cursor-pointer flex justify-start items-center w-full border px-7 py-4 rounded-[5px]"
      >
        <div className="">
          <BiCurrentLocation className="text-xl text-primary" />
        </div>
        <div className="pl-2.5">
          <h2 className="">Select My Location</h2>
          <p className="">Auto Complete</p>
        </div>
      </div>
      <Radio.Group className="w-full mt-10" value={data.delivery_option}>
        <Space direction="vertical" size={40} className="w-full">
          <Radio
            value={"shuut"}
            onChange={(e) => onChange?.("delivery_option", e.target.value)}
            className="w-full border px-7 py-4 rounded-[5px]"
          >
            <div className="text-sm text-[#263238] pl-3">
              <h2 className="font-sofia-pro">
                SHUUT Delivery{" "}
                <span className="font-light pl-2.5">+234010000783</span>
              </h2>
              <p className="text-light mt-4">
                Bourdilon Court, Chevron, Lekki Ajah, Lagos, Nigeria
              </p>
            </div>
          </Radio>
          <Radio
            value="self"
            onChange={(e) => onChange?.("delivery_option", e.target.value)}
            className="w-full border px-7 py-4 rounded-[5px]"
          >
            <div className="text-sm text-[#263238] pl-3">
              <h2 className="font-sofia-pro">
                SELF Delivery{" "}
                <span className="font-light pl-2.5">+234010000783</span>
              </h2>
              <p className="text-light mt-4">
                Bourdilon Court, Chevron, Lekki Ajah, Lagos, Nigeria
              </p>
            </div>
          </Radio>
        </Space>
      </Radio.Group>
      {isInvalid && !data?.delivery_option ? (
        <div className="my-1 text-red-500">
          please select the delivery option
        </div>
      ) : null}
      <h1 className="mt-12 text-2xl font-lota font-semibold text-primary">
        Read Our Logistics Terms & Condiotions
      </h1>
      <div className="mt-10 h-96 bg-[#FBFBFB] p-10">
        <h2 className="text-2xl font-lota">Terms &amp; Conditions</h2>
      </div>
      <div className="flex pt-2">
        <Checkbox
          className="checkbox-label"
          onChange={(e) => onChange?.("accept_terms", e.target.checked)}
          checked={data.accept_terms}
        >
          Accept Terms &amp; Conditions
        </Checkbox>
      </div>
      {isInvalid && !data?.accept_terms ? (
        <div className="my-1 text-red-500">Please accept our terms</div>
      ) : null}
      <div className="mt-6 flex justify-end gap-5">
        <button
          onClick={onCancel}
          className="w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="w-[193px] font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Location;
