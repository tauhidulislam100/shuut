import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import Image from "next/image";
import OtpInput from "react-otp-input";
import { Modal } from ".";
import Button from "./UI/Button";
import { Input } from "antd";
import { useRouter } from "next/router";

interface VerificationProps {
  visible: boolean;
  onCancel: () => void;
  onVerify: (opt: string) => void;
  onSendVerificationCode?: (input?: string) => void;
  showOTPForm?: boolean;
  email?: string;
  loading?: boolean;
  verifyOption?: "email" | "phone";
}

const Verification = ({
  visible,
  showOTPForm = false,
  loading = false,
  email,
  verifyOption = "email",
  onSendVerificationCode,
  onCancel,
  onVerify,
}: VerificationProps) => {
  const [phone, setPhone] = useState<string | undefined>();
  const [userEmail, setUserEmail] = useState<string>();
  const [otp, setOtp] = useState<string>("");
  const [visibleOTPForm, setVisibleOtpForm] = useState<boolean>();
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    setVisibleOtpForm(showOTPForm);
  }, [showOTPForm]);

  const router = useRouter();

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    let time = 60;
    const id = setInterval(() => {
      time--;
      setResendTimer(time);
      if (time <= 0) {
        clearInterval(id);
      }
    }, 1000);

    if (verifyOption === "email") {
      console.log("email resend ", email);
      onSendVerificationCode?.(email);
    } else {
      console.log("phone resend ", phone);
      onSendVerificationCode?.(phone);
    }
  };

  const PhoneNumberForm = (
    <>
      <div className="flex justify-center items-center">
        <Image src="/images/bulb.png" alt="Bulb Icon" width={30} height={30} />
      </div>
      <h1 className="mt-5 text-center font-semibold text-4xl text-primary">
        Enter Your Phone Number
      </h1>
      <p className="mt-[18px] text-2xl text-[#010918F7] text-center">
        In order to secure your new SHUUT account we will
        <br />
        need to verify your phone number.
      </p>
      <div className="w-full flex justify-center mt-5">
        <PhoneInput
          value={phone}
          country="ng"
          containerClass="w-auto"
          dropdownClass="bg-white"
          inputClass="h-10"
          onChange={(num) => setPhone(num)}
        />
      </div>
      <div className="mt-5 flex justify-center">
        <Button
          loading={loading}
          onClick={() => onSendVerificationCode?.(phone)}
          className="min-w-[275px] btn px-6 py-5 text-xl bg-secondary text-white"
        >
          Send Verification Code
        </Button>
      </div>
    </>
  );

  const EmailForm = (
    <>
      <div className="flex justify-center items-center">
        <Image src="/images/bulb.png" alt="Bulb Icon" width={30} height={30} />
      </div>
      <h1 className="mt-5 text-center font-semibold text-4xl text-primary">
        Enter Email Address
      </h1>
      <p className="mt-[18px] text-2xl text-[#010918F7] text-center">
        In order to secure your new SHUUT account we will
        <br />
        need to verify your email address.
      </p>
      <div className="w-full flex justify-center mt-5">
        <Input
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
      </div>
      <div className="mt-5 flex justify-center">
        <Button
          loading={loading}
          onClick={() => onSendVerificationCode?.(userEmail)}
          className="min-w-[275px] btn px-6 py-5 text-xl bg-secondary text-white"
        >
          Send Verification Code
        </Button>
      </div>
    </>
  );

  const OTPForm = (
    <>
      <div className="flex justify-center items-center">
        <Image src="/images/bulb.png" alt="Bulb Icon" width={30} height={30} />
      </div>
      <h1 className="mt-5 text-center font-semibold text-4xl text-primary">
        Validate Token
      </h1>
      <p className="mt-[18px] text-2xl text-[#010918F7] text-center">
        {email ? (
          <>
            An OTP was sent to your email{" "}
            <span className="text-primary-100 underline">{email}</span>,<br />
            please check and enter below.
          </>
        ) : (
          <>
            An OTP was sent to your phone number {phone},<br />
            please check and enter below.
          </>
        )}
      </p>
      <div className="w-full flex justify-center mt-5">
        <OtpInput
          value={otp}
          onChange={(o: string) => setOtp(o)}
          placeholder="****"
          numInputs={4}
          containerStyle="react-otp-input"
          inputStyle={{
            width: "3rem",
            height: "3rem",
            paddingTop: "5px",
            margin: "0 0.6rem",
            fontSize: "2rem",
            borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.3)",
          }}
        />
      </div>
      <div className="mt-5 flex justify-center">
        <Button
          loading={loading}
          onClick={() => onVerify(otp)}
          className="min-w-[275px] btn px-6 py-5 text-xl bg-secondary text-white"
        >
          Verify
        </Button>
      </div>
      <div className="pb-10 text-center text-[#898CA6] text-2xl font-semibold font-lota pt-4">
        Didn&apos;t get OTP?{" "}
        <button
          disabled={resendTimer > 0}
          className="text-secondary disabled:text-gray-400"
          onClick={handleResendOtp}
        >
          {resendTimer > 0 ? (
            <span className="text-secondary font-semibold">
              {resendTimer}
              <small>s</small>
            </span>
          ) : (
            "Resend"
          )}
        </button>
      </div>
    </>
  );

  return (
    <Modal
      width={935}
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
    >
      <div className="font-lota px-16 py-10">
        {visibleOTPForm
          ? OTPForm
          : verifyOption === "phone"
          ? PhoneNumberForm
          : EmailForm}
      </div>
    </Modal>
  );
};

export default Verification;
