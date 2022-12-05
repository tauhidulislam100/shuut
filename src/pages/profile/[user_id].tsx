import React, { useEffect, useMemo, useRef, useState } from "react";
import { Footer, NavBar, Review } from "../../components";
import { BsArrowLeftCircle } from "react-icons/bs";
import { Avatar, notification, Tabs } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_LENDER_DETAILS } from "../../graphql/query_mutations";
import Rental from "../../components/profile/lender/Rental";
import useAsyncEffect from "use-async-effect";
import { useRouter } from "next/router";

const { TabPane } = Tabs;

const LenderProfile = () => {
  const [activeTab, setActiveTab] = useState<string>("4");
  const { user } = useAuth();
  const router = useRouter();
  const [getLenderDetails, { loading, data }] =
    useLazyQuery(GET_LENDER_DETAILS);

  useAsyncEffect(
    async (isMounted) => {
      if (isMounted() && router?.query?.user_id) {
        await getLenderDetails({
          variables: {
            userId: router?.query?.user_id,
          },
        });
      }
    },
    [router]
  );

  return (
    <>
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
        <section className="lg:px-40 mt-10">
          <h1 className="font-lota font-semibold text-[32px]">Profile</h1>
          <div
            className="relative mt-7 h-[233px] bg-profile-bg bg-no-repeat bg-cover rounded-md"
            style={{
              backgroundImage: `url(${
                data?.user?.profile?.cover_photo ?? "/images/profile_bg.png"
              })`,
            }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3">
              <Avatar
                size={153}
                alt="profile pic"
                src={data?.user?.profile_photo ?? "/images/profile.png"}
              />
            </div>
          </div>
          <h3 className="mt-[88px] font-lota text-lg text-center text-[#23262F]">
            Videographer by day, night watcher by night
          </h3>
          <Tabs
            className="profile-tabs mt-[121px]"
            onChange={setActiveTab}
            activeKey={activeTab}
          >
            <TabPane key={"1"} tab="Profile">
              <div className="bg-[#FCFCFD] border border-[#DFDFE6] rounded-[10px] p-4">
                <div className="flex justify-between items-start mb-4 last:mb-0">
                  <strong>Name:</strong>
                  <span>
                    {data?.user?.firstName} {data?.user?.lastName}
                  </span>
                </div>
                <div className="flex justify-between items-start mb-4 last:mb-0">
                  <strong>Email Address:</strong>
                  <span>{data?.user?.email}</span>
                </div>
                <div className="flex justify-between items-start mb-4 last:mb-0">
                  <strong>Phone Number:</strong>
                  <span>{data?.user?.phone}</span>
                </div>
                <div className="flex justify-between items-start mb-4 last:mb-0">
                  <strong>Address:</strong>
                  <span>{data?.user?.addresses?.[0]?.delivery_address}</span>
                </div>
                <div className="flex justify-between items-start mb-4 last:mb-0">
                  <strong>Business Name:</strong>
                  <span>{data?.user?.profile?.business_name}</span>
                </div>
                <div className="flex justify-between items-start mb-4 last:mb-0">
                  <strong>Store Location:</strong>
                  <span>{data?.user?.phone}</span>
                </div>
                <div className="flex justify-between items-start mb-4 last:mb-0">
                  <strong>Opening Hours:</strong>
                  <span>{data?.user?.profile?.opening_hours}</span>
                </div>
                <div className="flex justify-between items-start mb-4 last:mb-0">
                  <strong>Closing Hours:</strong>
                  <span>{data?.user?.profile?.closing_hours}</span>
                </div>
                <div className="flex justify-between items-start mb-4 last:mb-0">
                  <strong>Descrption:</strong>
                  <span>{data?.user?.profile?.description}</span>
                </div>
              </div>
            </TabPane>
            <TabPane key={"4"} tab="Rental Shop">
              <div className="mt-10"></div>
              <Rental />
            </TabPane>
            <TabPane key={"5"} tab="Review">
              <Review />
            </TabPane>
          </Tabs>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LenderProfile;
