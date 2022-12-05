import React from "react";
import { Checkbox } from "antd";
import AddressForm from "./AddressForm";

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
  return (
    <div className="">
      <AddressForm
        selectedAddressId={data?.address_id}
        onChange={(addr) => onChange?.("address_id", addr?.id)}
      />
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
