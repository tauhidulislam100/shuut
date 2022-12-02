import React, { useMemo, useState } from "react";
import {
  Footer,
  IdForm,
  NavBar,
  TakePhoto,
  UploadId,
  UploadPassport,
} from "../components";
import { BsArrowLeftCircle } from "react-icons/bs";
import CheckPhoto from "../components/verification/UploadPassport";
import LastStep from "../components/verification/LastStep";

const KYC = () => {
  const [step, setStep] = useState(0);

  const nextHandler = () => {
    if (step >= 4) return setStep(0);
    setStep((prevState) => prevState + 1);
  };

  const getStep = useMemo(() => {
    switch (step) {
      case 0:
        return <UploadId handleNext={nextHandler} />;
      case 1:
        return <IdForm handleNext={nextHandler} />;
      case 2:
        return <TakePhoto handleNext={nextHandler} />;
      // case 3:
      //   return <UploadPassport handleNext={nextHandler} />;
      case 3:
        return <CheckPhoto handleNext={nextHandler} />;
      case 4:
        return <LastStep handleNext={nextHandler} />;
      default:
        return null;
    }
  }, [step]);

  return (
    <div className="">
      <NavBar />
      <div className="border-b"></div>
      <main className="container mt-5">
        <div className="">
          <button className="text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center">
            <span className="mr-2 text-secondary">
              <BsArrowLeftCircle />
            </span>
            back
          </button>
        </div>
        <div className="max-w-[1080px] mx-auto">{getStep}</div>
      </main>
      <Footer />
    </div>
  );
};

export default KYC;
