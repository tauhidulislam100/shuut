import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { BsMessenger, BsTwitter } from "react-icons/bs";
import { TiInfinity, TiSocialLinkedin } from "react-icons/ti";
import { SUBSCRIBE_NEWSLETTER } from "../../graphql/query_mutations";
import { Spin, notification } from "antd";

const Footer = ({ className = "" }: { className?: string }) => {
  const [email, setEmail] = useState("");
  const [subscribeNewsLetter, { loading }] = useMutation(SUBSCRIBE_NEWSLETTER, {
    onCompleted() {
      notification.success({
        message: "Thanks for subscribing our newsletter",
      });
      setEmail("");
    },
    onError(error) {
      notification.error({
        message: "Unable to subscribe newsletter " + error.message,
      });
    },
  });

  const handleSubscribe = async () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      return notification.error({
        message: "invalid email address",
      });
    }
    subscribeNewsLetter({
      variables: {
        email,
      },
    });
  };
  return (
    <footer className={className}>
      <div className="container py-20">
        <div className="space-y-10 text-center sm:text-left sm:space-y-0 grid sm:grid-cols-3  mdMax:place-items-center lg:grid-cols-6 grid-cols-1 gap-4">
          <div className="lg:col-span-2 mdMax:self-start">
            <h3 className="text-[21px] text-body-200 font-black mb-[18px]">
              SHUUT
            </h3>
            <p className="text-base text-body-200 font-normal mdMax:max-w-[172px]">
              Ecommerce platform for camera rentals.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-7">
              <a
                href="https://linkedin.com"
                className="text-body-200 text-2xl hover:text-body-200"
              >
                <TiSocialLinkedin />
              </a>
              <a
                href="https://messenger.com"
                className="text-body-200 text-lg hover:text-body-200"
              >
                <BsMessenger />
              </a>
              <a
                href="https://twitter.com"
                className="text-body-200 text-lg hover:text-body-200"
              >
                <BsTwitter />
              </a>
              <a
                href="https://facebook.com"
                className="text-body-200 text-2xl hover:text-body-200"
              >
                <TiInfinity />
              </a>
            </div>
          </div>
          <div className="lg:col-span-1">
            <h3 className="text-2xl text-primary-100 font-semibold mb-[18px]">
              Company
            </h3>
            <ul>
              <li>
                <a
                  href="#"
                  className="text-body-200 text-base hover:text-body-200 block mb-3"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body-200 text-base hover:text-body-200 block mb-3"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body-200 text-base hover:text-body-200 block mb-3"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body-200 text-base hover:text-body-200 block mb-3"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-1">
            <h3 className="text-2xl text-primary-100 font-semibold mb-[18px]">
              Top Cities
            </h3>
            <ul>
              <li>
                <a
                  href="#"
                  className="text-body-200 text-base hover:text-body-200 block mb-3"
                >
                  Lagos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body-200 text-base hover:text-body-200 block mb-3"
                >
                  Abuja
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body-200 text-base hover:text-body-200 block mb-3"
                >
                  Kaduna
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body-200 text-base hover:text-body-200 block mb-3"
                >
                  Delta
                </a>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-2 sm:col-span-full">
            <h3 className="text-2xl text-primary-100 font-semibold mb-[18px]">
              Join Our Newsletter
            </h3>
            <div className="flex items-center w-full max-w-full border border-body-light rounded-lg relative overflow-hidden">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="sm:min-w-max px-4 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light"
              />
              <button
                onClick={handleSubscribe}
                className="px-6 h-12 bg-secondary text-white min-w-max rounded-r-lg"
              >
                {loading ? <Spin className="purple-button" /> : "Subscribe"}
              </button>
            </div>
            <p className="text-body-200 text-opacity-50 opacity-70 mt-5 text-base">
              * Will send you weekly updates for your better rental deals.
            </p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="border-t border-[#C6CACC] border-opacity-20 py-4 md:mx-20">
          <p className="text-center text-primary-100 text-sm sm:text-base font-[450]">
            Copyright @SHUUT 2022. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
