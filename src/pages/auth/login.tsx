import React, { useState } from "react";
import Link from "next/link";
import { Checkbox, Form, Input, notification } from "antd";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { FcGoogle } from "react-icons/fc";
import cookie from "js-cookie";
import { FaFacebook, FaApple } from "react-icons/fa";
import { Footer, NavBar } from "../../components";
import { IoIosSearch } from "react-icons/io";
import Button from "../../components/UI/Button";
import { parseJwt } from "../../utils/utils";
import { useAuth } from "../../hooks/useAuth";
import SocialIncompletSignup from "./social_incomplete_signup";
import { useRouter } from "next/router";

const SIGNIN_MUTATION = gql`
  mutation ($email: String!, $password: String!) {
    user: SignIn(email: $email, password: $password) {
      accessToken
    }
  }
`;

const Login = () => {
  const { handleOAuth, setToken } = useAuth();
  const router = useRouter();
  const [signInUser, { loading }] = useMutation(SIGNIN_MUTATION, {
    onError: (e) => onError(e),
    onCompleted: (data) => onSignInComplete(data),
  });

  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });
  const [incompleteQuery, setInCompleteQuery] = useState<URLSearchParams>();

  const onError = (error: ApolloError) => {
    notification.error({
      message: error.message,
    });
  };

  const onSignInComplete = (data: any) => {
    if (data.user.accessToken) {
      cookie.set("token", data.user.accessToken, {
        expires: 1,
      });
      setToken?.(data.user.accessToken);
      router.replace((router.query.redirect as string) ?? "/");
    } else {
      notification.error({
        message: "something went wrong, login not success",
      });
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInForm({
      ...signInForm,
      [e.target.name]: e.target.value,
    });
  };

  const onSignIn = async () => {
    if (!signInForm.email || !signInForm.password) {
      notification.warn({
        message: "invalid email or password",
      });
      return;
    }
    await signInUser({
      variables: {
        ...signInForm,
      },
    });
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
          <div className="px-2 text-center mt-10 mb-20 uppercase text-[#525252]">
            -or-
          </div>
          <div className="login-form sm:w-[45%] !mx-auto">
            <Form.Item>
              <Input
                onChange={onChange}
                name="email"
                value={signInForm.email}
                placeholder="Email"
                className="bottom_bordered_input"
              />
            </Form.Item>
            <Form.Item>
              <Input.Password
                onChange={onChange}
                name="password"
                value={signInForm.password}
                placeholder="Password"
                className="bottom_bordered_input"
              />
            </Form.Item>
            <p className="font-sofia-pro text-[#263238] text-right mb-10">
              Forgot Password? Click{" "}
              <Link href={"/auth/forgot"}>
                <a className="text-secondary hover:text-primary font-semibold mr-1">
                  Here
                </a>
              </Link>
              to Reset
            </p>
            <Form.Item
              name="remember"
              className="font-sofia-pro"
              valuePropName="checked"
            >
              <Checkbox>
                Send me updates about cool new gear, Production jobs, and
                inspiration from <span className="text-secondary">SHUUT</span>{" "}
                community.
              </Checkbox>
            </Form.Item>
            <div className="flex justify-center mt-10">
              <Button
                onClick={onSignIn}
                loading={loading}
                className="btn w-[275px] px-6 py-[18px]  text-xl bg-secondary text-white"
              >
                Log In
              </Button>
            </div>
            <p className="my-10 text-center sm:text-left">
              Don&apos;t have an account?{" "}
              <Link href={"/auth/signup"}>
                <a className="text-secondary">Sign Up</a>
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
    </div>
  );
};

export default Login;
