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
    </div>
  );
};

export default DocumentOrigin;
