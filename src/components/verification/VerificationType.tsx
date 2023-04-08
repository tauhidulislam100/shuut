import React, { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Form, Radio } from "antd";
import DocumentOrigin from "./DocuemntOrigin";
import { supportedDocuments } from "../../pages/kyc";

interface IProps {
  onChange: (name: string, value?: string) => void;
  handleNext: () => void;
  kycForm: Record<string, any>;
  errorMessage?: string;
}

const VerificationType = ({
  handleNext,
  onChange,
  kycForm,
  errorMessage,
}: IProps) => {
  const [documentType, setDocumentType] = useState<string>(
    kycForm.documentType
  );

  useEffect(() => {
    if (
      kycForm.countryCode &&
      kycForm.countryCode !== "GH" &&
      documentType !== kycForm.documentType
    ) {
      onChange("documentType", documentType);
      onChange(
        "verificationType",
        supportedDocuments[kycForm.countryCode][documentType as string]
      );
    } else if (kycForm.countryCode && documentType !== kycForm.documentType) {
      onChange("documentType", documentType);
    }
  }, [documentType, kycForm, onChange]);

  return (
    <div className={`${!kycForm.countryCode ? "mb-20" : "mb-5"}`}>
      <DocumentOrigin
        onChange={onChange}
        kycForm={kycForm}
        handleNext={handleNext}
      />

      {errorMessage ? (
        <p className="font-lota text-lg text-red-500 mt-2">{errorMessage}</p>
      ) : null}
      {kycForm.countryCode ? (
        <Form className="mt-6">
          <h5 className="">Choose Verification Type:</h5>
          <Radio.Group className="w-full" value={kycForm.documentType}>
            {supportedDocuments[kycForm.countryCode]?.["nid"] ? (
              <div className="flex justify-between w-full border border-body-light rounded-[5px] p-5 mt-4">
                <Radio
                  name="id_type"
                  value={"nid"}
                  checked={kycForm.documentType === "nid"}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="kyc-option"
                >
                  <h3 className="font-sofia-pro text-sm text-[#263238]">
                    National Identification
                  </h3>
                </Radio>
                <div className="ml-auto">
                  <MdKeyboardArrowRight className="text-xl text-[#323232]" />
                </div>
              </div>
            ) : null}

            {supportedDocuments[kycForm.countryCode]?.["license"] ? (
              <div className="flex justify-between w-full border border-body-light rounded-[5px] p-5 mt-6">
                <Radio
                  className="kyc-option"
                  name="id_type"
                  value={"license"}
                  checked={kycForm.documentType === "license"}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  <h3 className="font-sofia-pro text-sm text-[#263238]">
                    Driver’s Licence
                  </h3>
                </Radio>
                <div className="ml-auto">
                  <MdKeyboardArrowRight className="text-xl text-[#323232]" />
                </div>
              </div>
            ) : null}

            {supportedDocuments[kycForm.countryCode]?.["passport"] ? (
              <div className="flex justify-between w-full border border-body-light rounded-[5px] p-5 mt-6">
                <Radio
                  className="kyc-option"
                  name="id_type"
                  value={"passport"}
                  checked={kycForm.documentType === "passport"}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  <h3 className="font-sofia-pro text-sm text-[#263238]">
                    Passport
                  </h3>
                </Radio>
                <div className="ml-auto">
                  <MdKeyboardArrowRight className="text-xl text-[#323232]" />
                </div>
              </div>
            ) : null}
          </Radio.Group>
          {kycForm.countryCode === "GH" && kycForm.documentType === "nid" ? (
            <>
              <Radio.Group className="mt-6">
                <h4 className="text-primary text-xl font-lota font-semibold mb-4">
                  Select Voter Id Type
                </h4>
                {supportedDocuments[kycForm.countryCode][
                  kycForm.documentType
                ].map((idtype: Record<string, any>) => (
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
                ))}
              </Radio.Group>
            </>
          ) : null}
          <div className="mt-6">
            <h2 className="text-primary text-2xl font-lota font-semibold">
              Complete Identity Check
            </h2>
            <p className="text-lg font-lota mt-5">
              You will have the option to use the camera on your phone when
              needed.
            </p>
            <div className="border rounded-[5px] mt-10 bg-[#FCFCFD] font-lota">
              <p className="p-8">
                You will have the option to use the camera on your phone when
                needed. By clicking the button below, you’re aggreing to the{" "}
                <a href="#" className="text-secondary hover:text-secondary">
                  privacy policy
                </a>{" "}
                of SHUUT, your biometric information, will be stored for more
                than 3 years.
              </p>
            </div>
          </div>
          <div className="mt-12 flex justify-end gap-5">
            <button
              onClick={() => {
                // if (
                //   !kycForm.countryCode ||
                //   !kycForm.documentType ||
                //   !kycForm.verificationType
                // ) {
                //   return;
                // }
                handleNext();
              }}
              className="w-[193px] hover:bg-primary font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold"
            >
              Next
            </button>
          </div>
        </Form>
      ) : null}
    </div>
  );
};

export default VerificationType;
