import React, { useEffect, useMemo, useState } from "react";
import {
  Footer,
  InfoForm,
  NavBar,
  PhotoStart,
  TakePhoto,
  VerificationType,
} from "../components";
import { BsArrowLeftCircle } from "react-icons/bs";
import LastStep from "../components/verification/LastStep";
import { useMutation } from "@apollo/client";
import { VERIFY_USER_KYC } from "../graphql/query_mutations";
import { notification } from "antd";
import AuthGuard from "../components/auth-guard/AuthGuard";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";

export const supportedDocuments: Record<string, any> = {
  NG: {
    // passport: "PASSPORT-FACE-MATCH-VERIFICATION",
    passport: "PASSPORT-FULL-DETAILS",
    // nid: "VIN-FACE-MATCH-VERIFICATION",
    nid: "VIN-FULL-DETAILS-VERIFICATION",
    license: "DRIVER-LICENSE-FULL-DETAIL-VERIFICATION",
  },
  GH: {
    nid: [
      { label: "Ghana Old Voter Id", value: "GH-OLD-VOTER-ID" },
      { label: "Ghana New Voter Id", value: "GH-NEW-VOTER-ID" },
    ],
    license: "GH-DRIVER-LICENSE-VERIFICATION",
  },
  ZA: {
    nid: "ZA-NATIONAL-ID",
  },
  KE: {
    passport: "KE-PASSPORT-FULL-DETAILS",
    nid: "KE-NATIONAL-ID",
  },
};

const KYC = () => {
  const { refetchCurrentUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [kycForm, setKycForm] = useState({
    documentType: "",
    verificationType: "",
    countryCode: "",
    searchParameter: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    selfie: "",
    selfieToDatabaseMatch: true,
  });
  const [errorMessage, setErrorMessage] = useState<string>();
  const [verifyUserKyc, { loading }] = useMutation(VERIFY_USER_KYC, {
    onCompleted(data) {
      refetchCurrentUser?.();
      notification.success({
        message: "your details has been succesfull verified",
      });
      setStep(4);
    },
    onError(error) {
      notification.error({
        message: `${error.message}\nwe are unable to verify your information please try again with vaild info`,
      });
    },
  });

  useEffect(() => {
    setErrorMessage(undefined);
  }, [kycForm]);

  const getStep = useMemo(() => {
    const nextHandler = () => {
      if (!kycForm.documentType) {
        setErrorMessage("please select verification type");
        console.log("stack here0");
        return;
      }

      if (step === 1 && !kycForm.searchParameter) {
        setErrorMessage("please fill all form fields accordingly");
        return;
      }

      if (
        step === 1 &&
        kycForm.countryCode === "NG" &&
        kycForm.documentType === "passport" &&
        (!kycForm.searchParameter ||
          !kycForm.lastName ||
          !kycForm.firstName ||
          !kycForm.dob)
      ) {
        setErrorMessage("please fill all form fields accordingly");
        return;
      }

      if (
        step === 1 &&
        ((kycForm.countryCode === "NG" && kycForm.documentType == "license") ||
          kycForm.countryCode !== "NG")
      ) {
        // if country is not nigeria or country is nigeria and document type is license then we don't have to go any further step
        return;
      }

      setErrorMessage("");
      setStep((prevState) => prevState + 1);
    };

    const onSubmitKyc = async () => {
      let verificationType = kycForm.verificationType;
      if (kycForm.countryCode === "GH" && kycForm.documentType === "license") {
        verificationType = "GH-DRIVER-LICENSE-VERIFICATION";
      }
      await verifyUserKyc({
        variables: {
          ...kycForm,
          verificationType,
        },
      });
    };

    switch (step) {
      case 0:
        return (
          <VerificationType
            errorMessage={errorMessage}
            kycForm={kycForm}
            onChange={(name, v) => {
              console.log(`${name}:${v}`);
              setKycForm((p) => ({ ...p, [name]: v }));
            }}
            handleNext={nextHandler}
          />
        );
      case 1:
        return (
          <InfoForm
            errorMessage={errorMessage}
            kycForm={kycForm}
            loading={loading}
            onChange={(name, v) => {
              setKycForm((p) => ({ ...p, [name]: v }));
            }}
            handleNext={onSubmitKyc}
            handlePrev={() => setStep((p) => p - 1)}
          />
        );
      case 2:
        return (
          <PhotoStart
            handlePrev={() => setStep((p) => p - 1)}
            handleNext={nextHandler}
          />
        );
      case 3:
        return (
          <TakePhoto
            loading={loading}
            errorMessage={errorMessage}
            kycForm={kycForm}
            onChange={(name, value) => {
              setKycForm((p) => ({ ...p, [name]: value }));
            }}
            handlePrev={() => setStep((p) => p - 1)}
            handleNext={onSubmitKyc}
          />
        );
      case 4:
        return <LastStep />;
      default:
        return null;
    }
  }, [step, kycForm, errorMessage, loading, verifyUserKyc]);

  return (
    <AuthGuard>
      <NavBar />
      <div className="border-b"></div>
      <main className="container mt-5">
        {step === 0 ? (
          <div className="">
            <button
              onClick={router.back}
              className="text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center"
            >
              <span className="mr-2 text-secondary">
                <BsArrowLeftCircle />
              </span>
              back
            </button>
          </div>
        ) : null}
        <div className="max-w-[1080px] mx-auto">{getStep}</div>
      </main>
      <Footer />
    </AuthGuard>
  );
};

export default KYC;
