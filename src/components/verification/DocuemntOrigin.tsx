import { Radio, Select } from "antd";
import React, { useEffect, useState } from "react";

const { Option } = Select;

const countries = [
  { label: "Nigeria", value: "NG" },
  { label: "Kenya", value: "KE" },
  { label: "South Africa", value: "ZA" },
  { label: "Ghana", value: "GH" },
];

// const supportedDocuments: Record<string, any> = {
//   NG: {
//     passport: "PASSPORT-FACE-MATCH-VERIFICATION",
//     nid: "VIN-FACE-MATCH-VERIFICATION",
//     license: "DRIVER-LICENSE-FULL-DETAIL-VERIFICATION",
//   },
//   GH: {
//     nid: [
//       { label: "Ghana Old Voter Id", value: "GH-OLD-VOTER-ID" },
//       { label: "Ghana New Voter Id", value: "GH-NEW-VOTER-ID" },
//     ],
//     license: "GH-DRIVER-LICENSE-VERIFICATION",
//   },
//   ZA: {
//     nid: "ZA-NATIONAL-ID",
//   },
//   KE: {
//     passport: "KE-PASSPORT-FULL-DETAILS",
//     nid: "KE-NATIONAL-ID",
//   },
// };

interface IProps {
  handleNext: () => void;
  handlePrev?: () => void;
  kycForm: Record<string, any>;
  onChange?: (name: string, value?: string) => void;
}

const DocumentOrigin = ({ onChange, kycForm }: IProps) => {
  // const [selectedCountry, setSelectedCountry] = useState<string>();

  // useEffect(() => {
  //   if (selectedCountry && selectedCountry !== "GH") {
  //     onChange?.("countryCode", selectedCountry);
  //     onChange?.(
  //       "verificationType",
  //       supportedDocuments[selectedCountry][kycForm.documentType]
  //     );
  //   } else if (selectedCountry) {
  //     onChange?.("countryCode", selectedCountry);
  //   }
  // }, [selectedCountry, kycForm, onChange]);

  return (
    <div className="mt-5">
      <h1 className="text-[32px] font-lota font-semibold text-primary">
        Where are you from?
      </h1>
      {/* <p className="font-lota text-lg">
        SHUUT requires a photo of a government ID to verify your identity.
      </p> */}
      <div className="mt-6">
        <h4 className="mb-2">Choose Country:</h4>
        <Select
          value={kycForm.countryCode ? kycForm.countryCode : undefined}
          onChange={(v) => onChange?.("countryCode", v)}
          className="choose-country"
          placeholder="Select A Country"
        >
          {countries.map((country) => (
            <Option key={country.value} value={country.value}>
              {country.label}
            </Option>
          ))}
        </Select>
      </div>

      {/* <Radio.Group className="my-6">
        {selectedCountry === "GH" && kycForm.documentType === "nid" ? (
          <>
            <h4 className="text-primary text-2xl font-lota font-semibold mb-3">
              Select Voter Id Type
            </h4>
            {supportedDocuments[selectedCountry][kycForm.documentType].map(
              (idtype: Record<string, any>) => (
                <Radio
                  key={idtype.value}
                  className="kyc-option mb-2"
                  name="verificationType"
                  value={idtype.value}
                  checked={idtype.value === kycForm.verificationType}
                  onChange={(e) =>
                    onChange?.("verificationType", e.target.value)
                  }
                >
                  <h3 className="font-sofia-pro text-sm text-[#263238]">
                    {idtype.label}
                  </h3>
                </Radio>
              )
            )}
          </>
        ) : null}
      </Radio.Group> */}
      {/* <div className="">
        <h2 className="text-primary text-2xl font-lota font-semibold">
          Complete Identity Check
        </h2>
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
            onClick={handlePrev}
            className="w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            className="w-[193px] font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold"
          >
            Start Identity Check
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default DocumentOrigin;
