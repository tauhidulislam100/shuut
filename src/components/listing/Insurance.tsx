import React from "react";
import { Checkbox, Form, Input, Select, Spin } from "antd";
import Image from "next/image";

const Insurance = ({
  onSubmit,
  onCancel,
  onChange,
  data,
  isInvalid,
  loading = false,
  banks = [],
}: {
  onSubmit: () => void;
  onCancel: () => void;
  onChange?: (name: string, value: any) => void;
  data: Record<string, any>;
  isInvalid?: boolean;
  loading?: boolean;
  banks?: Record<string, any>[];
}) => {
  return (
    <div className="mt-20">
      <div className="flex justify-between items-center">
        <h2 className="font lota text-2xl">
          Our{" "}
          <span className="text-secondary font-semibold">Lender Guarantee</span>
          , underwritten by our partners covers you for up to #25,000 per item.
        </h2>
        <div className="">
          <Image
            src="/images/listing_logo.png"
            alt="Logo"
            width={80}
            height={80}
          />
        </div>
      </div>
      <div className="mt-10 h-96 bg-[#FBFBFB] p-10">
        <h2 className="text-2xl font-lota">Insurance</h2>
      </div>
      <div className="my-5">
        <h4 className="text-primary font-medium text-base">Bank</h4>
        <Select
          value={data.bank_id}
          onChange={(v) => onChange?.("bank_id", v)}
          className="choose-gender"
          placeholder="Select Bank"
        >
          {banks.map((bank) => (
            <Select.Option key={bank.id} value={bank.id}>
              {bank.name}
            </Select.Option>
          ))}
        </Select>
        {isInvalid && !data.bank_id ? (
          <div className="text-red-500">please select your bank</div>
        ) : null}
      </div>
      <div className="mb-4">
        <h4 className="text-base font-medium text-primary">Account Number</h4>
        <Input
          placeholder="Enter Account Number"
          value={data.account_number}
          onChange={(e) => onChange?.("account_number", e.target.value)}
        />
        {isInvalid && !data.account_number ? (
          <div className="text-red-500">
            please provide your bank account number
          </div>
        ) : null}
      </div>
      <div className="flex pt-2">
        <Checkbox
          className="checkbox"
          checked={data.accept_insurance}
          onChange={(e) => onChange?.("accept_insurance", e.target.checked)}
        >
          Accept Insurance
        </Checkbox>
      </div>
      {isInvalid && !data?.accept_insurance ? (
        <div className="my-1 text-red-500">
          please accept insurance terms and conditions
        </div>
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
          className="w-[193px] purple-button font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold"
        >
          {loading ? <Spin size="small" /> : "List Item"}
        </button>
      </div>
    </div>
  );
};

export default Insurance;
