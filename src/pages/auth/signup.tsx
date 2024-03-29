import React, { useState } from "react";
import Link from "next/link";
import { Form, Input, notification } from "antd";
import { ApolloError, useMutation } from "@apollo/client";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import cookie from "js-cookie";
import Button from "../../components/UI/Button";
import { Footer, NavBar } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import SocialIncompletSignup from "./social_incomplete_signup";
import { SIGNUP_MUTATION } from "../../graphql/query_mutations";
import AuthVerificationForm from "../../components/AuthVerificationForm";

const Signup = () => {
  const { handleOAuth } = useAuth();
  const [signUpUser, { loading: signupLoading }] = useMutation(
    SIGNUP_MUTATION,
    {
      onError: (e) => onError(e),
      onCompleted: (data) => onSignupComplete(data),
    }
  );
  const [signupData, setSignUpdata] = useState<Record<string, any>>();
  const [submited, setSubmited] = useState(false);
  const [visibleOnlyOtpForm, setVisibleOnlyOtpForm] = useState(true);
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [incompleteQuery, setInCompleteQuery] = useState<URLSearchParams>();
  const [showVerificationForm, setShowVerificationForm] = useState(false);

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
    setSignUpdata(data.result);
    setVisibleOnlyOtpForm(true);
    setShowVerificationForm(true);
  };

  const onOAuthLogin = async (provider: string) => {
    handleOAuth?.(provider, handleIncompletOAuth);
  };

  const handleIncompletOAuth = (query: URLSearchParams) => {
    setInCompleteQuery(query);
  };

  return (
    <div className="bg-white">
      <NavBar />
      <div className="container">
        {/* <div className="flex items-center w-[430px] max-w-full border border-body-light rounded-lg p-[2px] relative">
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
        </div> */}
        <div className="mt-28">
          <h1 className="font-lota text-center font-semibold text-[26px] text-[#525252]">
            Welcome to SHUUT
          </h1>
          <div className="flex justify-center items-center flex-wrap gap-5 mt-12">
            <button
              onClick={() => onOAuthLogin("google")}
              className="w-full sm:w-auto sm:min-w-[193px] px-4 flex justify-center font-sofia-pro bg-white border border-[#E8E8E8] rounded-md text-[#A1A1A1] h-12 items-center text-lg"
            >
              <FcGoogle className="mr-2 text-3xl" /> Continue with Google
            </button>
            <button
              onClick={() => onOAuthLogin("apple")}
              className="w-full sm:w-auto sm:min-w-[193px] px-4 flex justify-center font-sofia-pro bg-white border border-[#E8E8E8] rounded-md text-[#A1A1A1] h-12 items-center text-lg"
            >
              <FaApple className="mr-2 text-black text-3xl" /> Continue with
              Apple
            </button>
            <button
              onClick={() => onOAuthLogin("facebook")}
              className="w-full sm:w-auto sm:min-w-[193px] px-4 flex justify-center font-sofia-pro bg-white border border-[#E8E8E8] rounded-md text-[#A1A1A1] h-12 items-center xs:text-lg text-base"
            >
              <FaFacebook className="mr-2 text-[#3b5998] text-3xl" /> Continue
              with Facebook
            </button>
          </div>
          <div className="px-2 text-center mt-10 mb-20 uppercase text-[#A1A1A1]">
            - or -
          </div>
          <div className="login-form lg:w-[60%] md:w-[80%] w-full mx-auto">
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
                className="bottom_bordered_input"
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
                className="bottom_bordered_input"
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
                className="bottom_bordered_input"
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
                className="bottom_bordered_input"
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
                className="min-w-[275px] btn px-6 py-[18px] text-xl bg-secondary text-white"
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
          </div>
        </div>
      </div>
      <Footer className="bg-[#F4F3FA]" />
      {incompleteQuery ? (
        <SocialIncompletSignup
          query={incompleteQuery}
          onCancel={() => setInCompleteQuery(undefined)}
        />
      ) : null}
      {showVerificationForm ? (
        <AuthVerificationForm
          onVerificationComplete={() => {
            cookie.set("token", signupData?.token as string, {
              expires: 1,
            });
            window.location.href = "/";
          }}
          onClose={() => setShowVerificationForm(false)}
          showOnlyOtpForm={visibleOnlyOtpForm}
          email={signupForm.email}
        />
      ) : null}
    </div>
  );
};

export default Signup;
