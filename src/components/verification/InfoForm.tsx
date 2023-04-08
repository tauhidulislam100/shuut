import { Checkbox, Form, Input, Select } from "antd";
import React, { useState } from "react";
import Button from "../UI/Button";

interface IProps {
  onChange: (name: string, value?: string) => void;
  handleNext: () => void;
  handlePrev: () => void;
  kycForm: Record<string, any>;
  errorMessage?: string;
  loading?: boolean;
}

const InfoForm = ({
  kycForm,
  errorMessage,
  loading,
  onChange,
  handleNext,
  handlePrev,
}: IProps) => {
  const [agree, setAgree] = useState<boolean | undefined>(undefined);
  const label =
    kycForm.documentType === "nid"
      ? "National/Voter Id Card Number"
      : kycForm.documentType === "license"
      ? "Driving License Number"
      : "Passport Number";
  return (
    <div className="kyc-info">
      <Form labelCol={{ span: 24 }} className="my-8">
        {kycForm.verificationType === "PASSPORT-FULL-DETAILS" ? (
          <>
            <Form.Item label={label}>
              <Input
                placeholder={"Enter Your " + label}
                onChange={(e) => onChange("searchParameter", e.target.value)}
                value={kycForm.searchParameter}
              />
              {errorMessage ? (
                <p className="font-lota text-lg text-red-500 my-1">
                  {!kycForm.searchParameter
                    ? "passport number is required"
                    : ""}
                </p>
              ) : null}
            </Form.Item>
            <Form.Item label={"First Name"}>
              <Input
                placeholder={"Enter Your First Name"}
                onChange={(e) => onChange("firstName", e.target.value)}
                value={kycForm.firstName}
              />
              {errorMessage ? (
                <p className="font-lota text-lg text-red-500 my-1">
                  {!kycForm.firstName ? "firstName is required" : ""}
                </p>
              ) : null}
            </Form.Item>
            <Form.Item label={"Last Name"}>
              <Input
                placeholder={"Enter Your Last Name"}
                onChange={(e) => onChange("lastName", e.target.value)}
                value={kycForm.lastName}
              />
              {errorMessage ? (
                <p className="font-lota text-lg text-red-500 my-1">
                  {!kycForm.lastName ? "lastName is required" : ""}
                </p>
              ) : null}
            </Form.Item>
            <Form.Item label={"Date of Birth"}>
              <Input
                placeholder={"Eg. 1988-11-05"}
                onChange={(e) => onChange("dob", e.target.value)}
                value={kycForm.dob}
              />
              {errorMessage ? (
                <p className="font-lota text-lg text-red-500 my-1">
                  {!kycForm.dob ? "Date of Birth is required" : ""}
                </p>
              ) : null}
            </Form.Item>
            <Form.Item label={"Gender"}>
              <Select
                value={kycForm.gender ? kycForm.gender : undefined}
                onChange={(v) => onChange("gender", v)}
                className="choose-gender"
                placeholder="Select Gender"
              >
                {["Male", "Female"].map((gender) => (
                  <Select.Option key={gender} value={gender}>
                    {gender}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </>
        ) : null}
        {kycForm.verificationType === "VIN-FULL-DETAILS-VERIFICATION" ? (
          <>
            <Form.Item label={label}>
              <Input
                placeholder={"Enter Your " + label}
                onChange={(e) => onChange("searchParameter", e.target.value)}
                value={kycForm.searchParameter}
              />
              {errorMessage ? (
                <p className="font-lota text-lg text-red-500 my-1">
                  {!kycForm.searchParameter ? label + " is required" : ""}
                </p>
              ) : null}
            </Form.Item>
          </>
        ) : null}

        {kycForm.verificationType ===
        "DRIVER-LICENSE-FULL-DETAIL-VERIFICATION" ? (
          <>
            <Form.Item label={label}>
              <Input
                placeholder={"Enter Your " + label}
                onChange={(e) => onChange("searchParameter", e.target.value)}
                value={kycForm.searchParameter}
              />
              {errorMessage ? (
                <p className="font-lota text-lg text-red-500 my-1">
                  {!kycForm.searchParameter ? label + " is required" : ""}
                </p>
              ) : null}
            </Form.Item>
            <Form.Item label={"Date of Birth"}>
              <Input
                placeholder={"Eg. 1988-11-05"}
                onChange={(e) => onChange("dob", e.target.value)}
                value={kycForm.dob}
              />
              {errorMessage ? (
                <p className="font-lota text-lg text-red-500 my-1">
                  {!kycForm.dob ? "Date of Birth is required" : ""}
                </p>
              ) : null}
            </Form.Item>
          </>
        ) : null}
        {kycForm.countryCode !== "NG" ? (
          <>
            <Form.Item label={label}>
              <Input
                placeholder={"Enter Your " + label}
                onChange={(e) => onChange("searchParameter", e.target.value)}
                value={kycForm.searchParameter}
              />
              {errorMessage ? (
                <p className="font-lota text-lg text-red-500 my-1">
                  {!kycForm.searchParameter ? label + " is required" : ""}
                </p>
              ) : null}
            </Form.Item>
          </>
        ) : null}
      </Form>
      <div
        className={`border rounded-[5px] mt-10 bg-[#FCFCFD] font-lota flex p-6 ${
          agree === false ? "border-red-500" : ""
        }`}
      >
        <Checkbox
          className="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
        >
          I, Name, acknowledge that the information provided are true and
          accurate. Thus, it can be used by SHUUT for the purpose of verifying
          my identity and kept in storage for other security purposes.
        </Checkbox>
      </div>
      <div className="mt-12 flex justify-end gap-5">
        <button
          onClick={handlePrev}
          className="w-[120px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold"
        >
          Back
        </button>
        <Button
          loading={loading}
          onClick={agree ? handleNext : () => setAgree(false)}
          className="w-[193px] hover:bg-primary font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default InfoForm;
