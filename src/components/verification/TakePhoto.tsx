import React, { useEffect, useRef, useState } from "react";
import { BiCamera } from "react-icons/bi";
import Button from "../UI/Button";
import { Checkbox } from "antd";
import { useRouter } from "next/router";

interface IProps {
  handleNext: () => void;
  handlePrev: () => void;
  onChange: (name: string, value: string) => void;
  errorMessage?: string;
  kycForm: Record<string, any>;
  loading?: boolean;
}
const TakePhoto = ({
  handleNext,
  handlePrev,
  onChange,
  kycForm,
  errorMessage,
  loading,
}: IProps) => {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(kycForm.selfie);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rendered = useRef<boolean>(false);
  const [localError, setLocalError] = useState("");
  const [agree, setAgree] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (!rendered.current) {
      startCamera();
    }
    let r = videoRef.current;
    rendered.current = true;
    return () => {
      if (r) {
        r.pause();
        r.srcObject = null;
      }
    };
  }, [photo]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error: any) {
      setLocalError("please check your camera permission");
    }
  };

  // function to capture photo from webcam
  const capture = async () => {
    // get the video element that displays the webcam stream
    const videoElement = document.querySelector(
      "#videoElement"
    ) as HTMLVideoElement;

    // create a canvas element to convert the video frame to an image
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoElement, 0, 0);
    // convert the image to base64 format and store it in local state
    const base64 = canvas.toDataURL("image/jpeg");
    setPhoto(base64);
    onChange("selfie", base64);
  };

  return (
    <div className="mt-5 md:px-40">
      <p className="font-lota text-lg">
        Take a clear photo of your entire face.
      </p>
      <div className="mt-12 flex justify-center">
        <div className="flex rounded-[5px] overflow-hidden p-2 border">
          <div className="relative w-[400px] h-[250px] rounded-tl-[5px] rounded-bl-[5px] overflow-hidden">
            {!photo ? (
              <video
                id="videoElement"
                className="object-cover w-full h-full"
                autoPlay
                ref={videoRef}
              ></video>
            ) : (
              <img
                className="w-full h-full object-cover rounded-[5px]"
                src={photo}
                alt="selfie"
              />
            )}
          </div>
        </div>
      </div>
      {localError || errorMessage ? (
        <div className="text-red-500 font-medium font-sofia-pro text-center mt-2 text-base">
          {localError || errorMessage}
        </div>
      ) : null}
      <div className="mt-12 flex flex-col md:flex-row justify-center gap-5">
        {photo ? (
          <button
            onClick={() => {
              rendered.current = false;
              setPhoto(null);
              onChange("selfie", "");
            }}
            className="min-w-[193px] flex justify-center items-center font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 text-lg font-semibold"
          >
            <span className="text-xl pr-2">
              <BiCamera />
            </span>{" "}
            Retake Photo
          </button>
        ) : (
          <button
            onClick={capture}
            className="min-w-[193px] flex justify-center items-center font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 text-lg font-semibold"
          >
            <span className="text-xl pr-2">
              <BiCamera />
            </span>{" "}
            Take Photo
          </button>
        )}
      </div>
      <div
        className={`border rounded-[5px] mt-10 bg-[#FCFCFD] font-lota flex p-6 ${
          agree === false ? "border-red-500" : ""
        }`}
      >
        <Checkbox
          className="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
        />
        <p className="ml-2">
          I, Name, acknowledge that the information provided are true and
          accurate. Thus, it can be used by SHUUT for the purpose of verifying
          my identity and kept in storage for other security purposes.
        </p>
      </div>
      <div className="flex gap-4 items-center justify-end mt-4">
        <Button
          onClick={() => router.push("/")}
          className="min-w-[193px] px-8 font-sofia-pro bg-white border border-primary hover:bg-primary hover:text-white rounded-md text-secondary h-12 items-center text-lg font-semibold"
        >
          Cancel
        </Button>
        {photo ? (
          <Button
            loading={loading}
            onClick={agree ? handleNext : () => setAgree(false)}
            className="min-w-[193px] px-8 font-sofia-pro bg-secondary/20 hover:bg-secondary hover:text-white rounded-md text-secondary h-12 items-center text-lg font-semibold"
          >
            Submit
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default TakePhoto;
