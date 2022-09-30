import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Form, Input, notification, Spin } from "antd";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { Footer, NavBar } from "../../components";
import { IoIosSearch } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import Router from "next/router";
import Button from "../../components/UI/Button";
import { useAuth } from "../../hooks/useAuth";
import SocialIncompletSignup from "./social_incomplete_signup";

const Verification = dynamic(() => import("../../components/Verification"), {
  ssr: false,
});

export const SIGNUP_MUTATION = gql`
  mutation (
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $phone: String
    $emailVerified: Boolean
    $phoneVerified: Boolean
    $isActive: Boolean
    $postalCode: String
    $social_id: String
  ) {
    user: SignUp(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      phone: $phone
      emailVerified: $emailVerified
      phoneVerified: $phoneVerified
      isActive: $isActive
      postalCode: $postalCode
      social_id: $social_id
    ) {
      id
    }
  }
`;

export const VERIFICATION_MUTATION = gql`
  mutation ($code: String!, $verificationType: String!) {
    verification: VerifyCode(code: $code, verificationType: $verificationType) {
      status
    }
  }
`;

const Signup = () => {
  const { handleOAuth } = useAuth();
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

  const [visible, setVisible] = useState<boolean>(false);
  const [submited, setSubmited] = useState(false);
  const [visibleOnlyOtpForm, setVisibleOnlyOtpForm] = useState(true);
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [incompleteQuery, setInCompleteQuery] = useState<URLSearchParams>();

  const onChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm({
      ...signupForm,
      [e.target.name]: e.target.value,
    });
  };

  const onFormSubmit = async () => {
    setSubmited(true);
    if (
      !signupForm.email ||
      !signupForm.firstName ||
      !signupForm.lastName ||
      !signupForm.password
    ) {
      return;
    }
    await signUpUser({
      variables: {
        ...signupForm,
      },
    });
  };

  const onError = (error: ApolloError) => {
    notification.error({
      message: error.message,
    });
  };

  const onSignupComplete = (data: any) => {
    setVisible(true);
    setVisibleOnlyOtpForm(true);
  };

  const onCompleteVerifyEmail = (data: any) => {
    if (data.verification.status === "failed") {
      notification.error({
        message: "invalid opt provided",
      });
    } else {
      notification.success({
        message: "email verification complete",
      });
      setVisible(false);
      Router.push("/auth/login");
    }
  };

  const onOAuthLogin = async (provider: string) => {
    handleOAuth?.(provider, handleIncompletOAuth);
  };

  const handleIncompletOAuth = (query: URLSearchParams) => {
    setInCompleteQuery(query);
  };

  return (
    <div className="bg-white">
      <div className="container">
        <NavBar />
      </div>

      <div className="container">
        <div className="flex items-center w-[430px] max-w-full border border-body-light rounded-lg p-[2px] relative">
          <input
            placeholder="Search..."
            className="min-w-max px-10 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light bg-transparent"
          />
          <button className="px-7 h-12 bg-secondary text-white min-w-max rounded-r-lg">
            Find Gear
          </button>
          <span className="absolute top-4 left-4 text-lg text-[#263238]">
            <IoIosSearch />
          </span>
        </div>
        <div className="mt-28">
          <h1 className="font-lota text-center font-semibold text-[26px] text-[#525252]">
            Welcome to SHUUT
          </h1>
          <div className="flex justify-center items-center gap-5 mt-12">
            <button
              onClick={() => onOAuthLogin("google")}
              className="min-w-[193px] px-4 flex justify-center font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#A1A1A1] h-12 items-center text-lg"
            >
              <FcGoogle className="mr-2 text-3xl" /> Continue with Google
            </button>
            <button
              onClick={() => onOAuthLogin("apple")}
              className="min-w-[193px] px-4 flex justify-center font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#A1A1A1] h-12 items-center text-lg"
            >
              <FaApple className="mr-2 text-black text-3xl" /> Continue with
              Apple
            </button>
            <button
              onClick={() => onOAuthLogin("facebook")}
              className="min-w-[193px] px-4 flex justify-center font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#A1A1A1] h-12 items-center text-lg"
            >
              <FaFacebook className="mr-2 text-[#3b5998] text-3xl" /> Continue
              with Facebook
            </button>
          </div>
          <div className="px-2 text-center mt-10 mb-20 uppercase text-[#A1A1A1]">
            - or -
          </div>
          <Form size="large" className="login-form w-[70%] mx-auto">
            <Form.Item
              validateStatus={
                submited && !signupForm.firstName
                  ? "error"
                  : submited
                  ? "success"
                  : ""
              }
            >
              <Input
                onChange={onChangeField}
                value={signupForm.firstName}
                name="firstName"
                placeholder="First Name"
                className=""
              />
            </Form.Item>
            <Form.Item
              validateStatus={
                submited && !signupForm.lastName
                  ? "error"
                  : submited
                  ? "success"
                  : ""
              }
            >
              <Input
                onChange={onChangeField}
                value={signupForm.lastName}
                placeholder="Last Name"
                name="lastName"
                className=""
              />
            </Form.Item>
            <Form.Item
              validateStatus={
                submited && !signupForm.email
                  ? "error"
                  : submited
                  ? "success"
                  : ""
              }
            >
              <Input
                onChange={onChangeField}
                value={signupForm.email}
                placeholder="Email Address"
                name="email"
                className=""
              />
            </Form.Item>
            <Form.Item
              validateStatus={
                submited && !signupForm.password
                  ? "error"
                  : submited
                  ? "success"
                  : ""
              }
            >
              <Input.Password
                onChange={onChangeField}
                value={signupForm.password}
                placeholder="Password"
                name="password"
                className=""
              />
            </Form.Item>
            <Form.Item className="font-sofia-pro" valuePropName="checked">
              {/* <Checkbox onChange={e => setSignupForm({...signupForm, acceptTerms: e.target.checked})} value={signupForm.acceptTerms} name="acceptTerms">
                            </Checkbox> */}
              By signing up, I agree to SHUUT’s{" "}
              <span className="text-secondary">Terms of Service</span> and{" "}
              <span className="text-secondary">Privacy Policy</span>
            </Form.Item>
            <div className="flex justify-center">
              <Button
                loading={signupLoading}
                onClick={onFormSubmit}
                className="min-w-[275px] btn px-6 py-5 text-xl bg-secondary text-white"
              >
                Create My Account
              </Button>
            </div>
            <p className="my-10">
              {" "}
              Already have an account?{" "}
              <Link href="/auth/login">
                <a className="text-secondary">Log In</a>
              </Link>
            </p>
          </Form>
        </div>
      </div>
      <Footer />
      <SocialIncompletSignup
        query={incompleteQuery}
        onCancel={() => setInCompleteQuery(undefined)}
      />
      <Verification
        email={signupForm.email}
        onVerify={(otp) =>
          verifyEmail({ variables: { code: otp, verificationType: "email" } })
        }
        showOTPForm={visibleOnlyOtpForm}
        visible={visible}
        onCancel={() => setVisible(false)}
        loading={verificationLoading}
      />
    </div>
  );
};

export default Signup;
