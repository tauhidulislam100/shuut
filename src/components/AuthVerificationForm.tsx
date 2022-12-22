import { ApolloError, useMutation } from "@apollo/client";
import { notification } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  SEND_VERIFICATION_CODE_EMAIL,
  SEND_PHONE_VERIFICATION_CDOE,
  VERIFICATION_MUTATION,
} from "../graphql/query_mutations";
import Verification from "./AuthVerification";

interface IProps {
  email?: string;
  showOnlyOtpForm?: boolean;
  onClose?: () => void;
  onVerificationComplete?: () => void;
}

const VerificationForm = ({
  email,
  showOnlyOtpForm = true,
  onClose,
  onVerificationComplete,
}: IProps) => {
  const router = useRouter();

  const [sendEmailVerificationCode, {}] = useMutation(
    SEND_VERIFICATION_CODE_EMAIL,
    {
      onError: (e) => onError(e),
    }
  );
  const [
    sendPhoneVerificationCode,
    { loading: phoneverificationLoading1, data: phoneVerficationData },
  ] = useMutation(SEND_PHONE_VERIFICATION_CDOE, {
    onError: (e) => onError(e),
    onCompleted: (_) => {
      setVisibleOnlyOtpForm(true);
    },
  });

  const [verifyEmail, { loading: emailverificationLoading }] = useMutation(
    VERIFICATION_MUTATION,
    {
      onError: (e) => onError(e),
      onCompleted: (data) => onCompleteVerifyEmail(data),
    }
  );
  const [verifyPhone, { loading: phoneverificationLoading2 }] = useMutation(
    VERIFICATION_MUTATION,
    {
      onError: (e) => onError(e),
      onCompleted: (data) => onCompleteVerifyPhone(data),
    }
  );

  const [visibleEmailOtp, setVisibleEmailOtp] = useState<boolean>(true);
  const [visibleOnlyOtpForm, setVisibleOnlyOtpForm] = useState(showOnlyOtpForm);
  const [visiblePhoneOtp, setVisiblePhoneOtp] = useState(false);

  const onError = (error: ApolloError) => {
    notification.error({
      message: error.message,
    });
  };

  const onCompleteVerifyEmail = (data: any) => {
    if (data.result.status === "failed") {
      notification.error({
        message: "invalid opt provided",
      });
    } else {
      setVisibleOnlyOtpForm(false);
      setVisibleEmailOtp(false);
      setVisiblePhoneOtp(true);
    }
  };

  const onCompleteVerifyPhone = (data: any) => {
    if (data.result.status === "failed") {
      notification.error({
        message: "invalid opt provided",
      });
    } else {
      notification.success({
        message: "contact verfication is successful",
      });
      setVisibleOnlyOtpForm(false);
      setVisiblePhoneOtp(false);
      if (onVerificationComplete) {
        onVerificationComplete();
      } else {
        router.push("/auth/login");
      }
    }
    onClose?.();
  };

  return (
    <>
      <Verification
        verifyOption="email"
        email={email}
        onVerify={(otp) =>
          verifyEmail({ variables: { code: otp, verificationType: "email" } })
        }
        showOTPForm={visibleOnlyOtpForm}
        visible={visibleEmailOtp}
        onCancel={() => {
          setVisibleEmailOtp(false);
          onClose?.();
        }}
        loading={emailverificationLoading}
        onSendVerificationCode={(email) =>
          sendEmailVerificationCode({ variables: { email } })
        }
      />
      <Verification
        visible={visiblePhoneOtp}
        verifyOption="phone"
        loading={phoneverificationLoading1 || phoneverificationLoading2}
        showOTPForm={visibleOnlyOtpForm}
        onCancel={() => {
          setVisiblePhoneOtp(false);
          onClose?.();
        }}
        onVerify={(otp) => {
          verifyPhone({
            variables: {
              code: otp,
              transactionId: phoneVerficationData.result.transactionId,
              verificationType: "phone",
            },
          });
        }}
        onSendVerificationCode={(phone) => {
          sendPhoneVerificationCode({
            variables: {
              phone,
              email: email,
            },
          });
        }}
      />
    </>
  );
};

export default VerificationForm;
