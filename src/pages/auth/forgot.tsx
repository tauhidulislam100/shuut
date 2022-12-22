import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Footer, NavBar } from "../../components";
import { IoIosSearch } from "react-icons/io";
import { Form, Input, notification } from "antd";
import Image from "next/image";
import OtpInput from "react-otp-input";
import { ApolloError, gql, useMutation } from "@apollo/client";
import Button from "../../components/UI/Button";
import Router from "next/router";
import {
  RESET_PASSWORD_MUTATION,
  SET_NEW_PASSWORD_MUTATION,
} from "../../graphql/query_mutations";
const Modal = dynamic(() => import("../../components/UI/Modal"), {
  ssr: false,
});

const VERIFICATION_MUTATION = gql`
  mutation ($code: String!, $verificationType: String!) {
    verification: VerifyCode(code: $code, verificationType: $verificationType) {
      status
      resetToken
    }
  }
`;

const Forgot = () => {
  const [sendCode, { loading: sendCodeLoader }] = useMutation(
    RESET_PASSWORD_MUTATION,
    {
      onError: (error) => onError(error),
      onCompleted: (data) => {
        if (data.reset.status === "success") {
          setShowModal(true);
        }
      },
    }
  );
  const [verifyCode, { loading: verifyLoader }] = useMutation(
    VERIFICATION_MUTATION,
    {
      onError: (error) => onError(error),
      onCompleted: (data) => {
        if (data.verification.status === "success") {
          setResetForm((f) => ({
            ...f,
            resetToken: data.verification.resetToken,
          }));
          setShowModal(false);
          setToken(true);
        }
      },
    }
  );
  const [setNewPassword, { loading }] = useMutation(SET_NEW_PASSWORD_MUTATION, {
    onError: (error) => onError(error),
    onCompleted: (data) => {
      if (data.reset.status === "success") {
        Router.push("/auth/login");
      }
    },
  });
  const [token, setToken] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resetForm, setResetForm] = useState({
    code: "",
    email: "",
    password: "",
    password2: "",
    resetToken: "",
  });

  const handleSendResetCode = async () => {
    if (!resetForm.email) {
      return notification.error({
        message: "invalid email address",
      });
    }

    await sendCode({
      variables: {
        email: resetForm.email,
      },
    });
  };

  const verifyHandler = async () => {
    if (!resetForm.code) {
      return notification.error({
        message: "invalid otp provided",
      });
    }
    await verifyCode({
      variables: {
        code: resetForm.code,
        verificationType: "reset-password",
      },
    });
  };

  const handleSetNewPassword = async () => {
    if (
      !resetForm.password ||
      resetForm.password !== resetForm.password2 ||
      !resetForm.resetToken
    ) {
      return notification.error({
        message: !resetForm.resetToken
          ? "something went wrong please try again"
          : "invalid password",
      });
    }

    await setNewPassword({
      variables: {
        password: resetForm.password,
        resetToken: resetForm.resetToken,
      },
    });
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0 || !resetForm.email) return;
    let time = 60;
    const id = setInterval(() => {
      time--;
      setResendTimer(time);
      if (time <= 0) {
        clearInterval(id);
      }
    }, 1000);
    await sendCode({
      variables: {
        email: resetForm.email,
      },
    });
  };

  const onError = (error: ApolloError) => {
    notification.error({
      message: error.message,
    });
  };

  return (
    <div className="bg-white">
      <Modal width={935} open={showModal} onCancel={() => setShowModal(false)}>
        <div className="flex justify-center items-center pt-10">
          <Image
            src="/images/bulb.png"
            alt="Bulb Icon"
            width={30}
            height={30}
          />
        </div>
        <h1 className="mt-5 text-center font-semibold text-4xl text-primary">
          Validate Token
        </h1>
        <p className="mt-[18px] text-2xl text-[#010918F7] text-center">
          An OTP was sent to your email address {resetForm.email},<br />
          please check and enter below.
        </p>
        <div className="w-full flex justify-center mt-5">
          <OtpInput
            value={resetForm.code}
            onChange={(o: string) => setResetForm({ ...resetForm, code: o })}
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
            onClick={verifyHandler}
            loading={verifyLoader}
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
            onClick={handleResendOTP}
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
      </Modal>
      <NavBar />

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
          <h1 className="mb-12 font-lota text-center font-semibold text-[26px] text-[#525252]">
            Forgot Password
          </h1>
          {!token ? (
            <div className="login-form lg:w-[65%] w-full mx-auto">
              <Form.Item>
                <Input
                  placeholder="Email"
                  className="bottom_bordered_input"
                  value={resetForm.email}
                  onChange={(e) =>
                    setResetForm({ ...resetForm, email: e.target.value })
                  }
                />
              </Form.Item>
              <div className="flex justify-center mt-10">
                <Button
                  loading={sendCodeLoader}
                  onClick={handleSendResetCode}
                  className="btn w-[275px] px-6 py-5 text-xl bg-secondary text-white"
                >
                  Confirm
                </Button>
              </div>
            </div>
          ) : (
            <div className="login-form lg:w-[65%] w-full mx-auto">
              <Form.Item>
                <Input.Password
                  placeholder="New Password"
                  className="bottom_bordered_input"
                  value={resetForm.password}
                  onChange={(e) =>
                    setResetForm({ ...resetForm, password: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item>
                <Input.Password
                  placeholder="Confirm Password"
                  status={
                    resetForm.password !== resetForm.password2 ? "error" : ""
                  }
                  className="bottom_bordered_input"
                  value={resetForm.password2}
                  onChange={(e) =>
                    setResetForm({ ...resetForm, password2: e.target.value })
                  }
                />
              </Form.Item>
              <div className="flex justify-center mt-10">
                <Button
                  loading={loading}
                  onClick={handleSetNewPassword}
                  className="btn w-[275px] px-6 py-5 text-xl bg-secondary text-white"
                >
                  <span>Confirm</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Forgot;
