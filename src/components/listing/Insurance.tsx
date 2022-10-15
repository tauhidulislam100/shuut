import React from "react";
import { Checkbox, Radio, Space, Spin } from "antd";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { GetAllInsuranceQuery } from "../../graphql/query_mutations";

const Insurance = ({
  onSubmit,
  onCancel,
  onChange,
  data,
  isInvalid,
  loading = false,
}: {
  onSubmit: () => void;
  onCancel: () => void;
  onChange?: (name: string, value: any) => void;
  data: Record<string, any>;
  isInvalid?: boolean;
  loading?: boolean;
}) => {
  const { data: insuranceData } = useQuery(GetAllInsuranceQuery);

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
      <Radio.Group className="w-full mt-10" value={data?.insurance_id}>
        <Space direction="vertical" size={40} className="w-full">
          {insuranceData?.insurance?.map((insurance: Record<string, any>) => (
            <Radio
              key={insurance.id}
              value={insurance.id}
              className="w-full border px-7 py-4 rounded-[5px]"
              checked={data.insurance_id === insurance.id}
              onChange={(e) =>
                onChange?.(
                  "insurance_id",
                  e.target.checked ? insurance.id : null
                )
              }
            >
              <div className="text-sm text-[#263238] pl-3">
                <h2 className="font-sofia-pro">{insurance.policy_name}</h2>
              </div>
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      {isInvalid && !data?.insurance_id ? (
        <div className="my-1 text-red-500">please choose one of the policy</div>
      ) : null}
      <div className="mt-10 h-96 bg-[#FBFBFB] p-10">
        <h2 className="text-2xl font-lota">Insurance</h2>
      </div>
      <div className="flex pt-2">
        <Checkbox
          className="checkbox-label"
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
