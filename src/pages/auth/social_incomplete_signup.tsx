import { ApolloError, gql, useMutation } from "@apollo/client";
import { notification } from "antd";
import cookie from "js-cookie";
import React, { useEffect, useState } from "react";
import Verification from "../../components/Verification";
import {
  SIGNUP_MUTATION,
  VERIFICATION_MUTATION,
} from "../../graphql/query_mutations";

interface IProps {
  query?: URLSearchParams;
  onCancel?: () => void;
}

let token = "";

const SocialIncompletSignup = ({ query, onCancel }: IProps) => {
  const [signUpUser, { loading: signupLoading }] = useMutation(
    SIGNUP_MUTATION,
    {
      onError: (e) => onError(e),
      onCompleted: (data) => onSignupComplete(data),
    }
  );

  const [verifyEmail, { loading: verificationLoading }] = useMutation(
    VERIFICATION_MUTATION,
    {
      onError: (e) => onError(e),
      onCompleted: (data) => onCompleteVerifyEmail(data),
    }
  );
  const [visible, setVisible] = useState(false);
  const [showOTPForm, setShowOtpForm] = useState(false);
  const [signupForm, setSignupForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    social_id: "",
  });

  useEffect(() => {
    console.log(query);
    if (query && !visible) {
      const names = query.get("name")?.split(" ") as string[];
      setSignupForm((s) => ({
        ...s,
        firstName: names[0],
        lastName: names[1],
        social_id: query.get("social_id") as string,
      }));
      setVisible(true);
    }
    if (!query && visible) {
      setVisible(false);
    }
  }, [query, visible]);

  const handleSendVerificationCode = async (email?: string) => {
    if (email) {
      const formData = {
        ...signupForm,
        email,
      };
      setSignupForm((pre) => ({ ...pre, ...formData }));
      await signUpUser({
        variables: { ...formData },
      });
    } else {
      notification.error({
        message: "invalid email address",
      });
    }
  };

  const onError = (error: ApolloError) => {
    notification.error({
      message: error.message,
    });
  };

  const onSignupComplete = (data: any) => {
    token = data.result.token;
    setShowOtpForm(true);
  };

  const onCompleteVerifyEmail = (data: any) => {
    if (data.verification.status === "success") {
      cookie.set("token", token, {
        expires: 1,
      });
      window.location.href = "/";
    } else {
      notification.error({
        message: "unable to verify the code",
      });
    }
  };

  const handleOnCancel = () => {
    setVisible(false);
    onCancel?.();
  };

  return (
    <Verification
      verifyOption="email"
      email={signupForm.email}
      onSendVerificationCode={handleSendVerificationCode}
      onVerify={(otp) =>
        verifyEmail({ variables: { code: otp, verificationType: "email" } })
      }
      showOTPForm={showOTPForm}
      visible={visible}
      onCancel={handleOnCancel}
      loading={signupLoading || verificationLoading}
    />
  );
};

export default SocialIncompletSignup;
