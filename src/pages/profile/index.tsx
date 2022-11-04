import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Footer,
  NavBar,
  Review,
  Activities,
  RentalShop,
  Settings,
  EditProfile,
} from "../../components";
import { BsArrowLeftCircle } from "react-icons/bs";
import Image from "next/image";
import { Avatar, notification, Tabs } from "antd";
import AuthGuard from "../../components/auth-guard/AuthGuard";
import { useAuth } from "../../hooks/useAuth";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  GET_USER_INFO_BY_ID,
  UPSERT_PROFILE,
} from "../../graphql/query_mutations";
import {
  FileInfo,
  FilesUpload,
  FileUpload,
  Widget,
  WidgetAPI,
} from "@uploadcare/react-widget";
import { BiEditAlt } from "react-icons/bi";
import { FcAddImage } from "react-icons/fc";
import { RiImageEditFill } from "react-icons/ri";

const { TabPane } = Tabs;

const Profile = () => {
  const [activeTab, setActiveTab] = useState<string>("4");
  const profileRef = useRef<WidgetAPI | null>(null);
  const coverRef = useRef<WidgetAPI | null>(null);
  const { user } = useAuth();
  const [editProfileForm, setEditProfileForm] = useState({
    cover_photo: null,
    description: "",
    advance: 0,
    business_name: "",
    opening_hours: "",
    closing_hours: "",
    store_location: "",
    city: "",
    country: "",
    house_no: "",
    postcode: "",
    state: "",
    street: "",
    firstName: "",
    lastName: "",
    phone: "",
    profile_photo: null,
  });
  const { data: profileData } = useQuery(GET_USER_INFO_BY_ID, {
    variables: {
      id: user?.id,
    },
  });

  const [upsertProfile, { loading }] = useMutation(UPSERT_PROFILE, {
    onError: (error) => {
      console.log("error ", error);
      notification.error({
        message: error.message,
      });
    },
    onCompleted(data) {
      console.log("data: ", data);
      notification.success({
        message: "Profile update success",
      });
    },
  });

  useEffect(() => {
    if (profileData) {
      const { profile, address, firstName, lastName, profile_photo, phone } =
        profileData.userInfo;
      setEditProfileForm((prev) => ({
        ...prev,
        ...profile,
        ...address,
        firstName,
        lastName,
        profile_photo,
        phone,
      }));
    }
  }, [profileData]);

  const handleOnChangeInput = (name: string, value: string) => {
    setEditProfileForm((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const getActiveTab = useMemo(() => {
    switch (activeTab) {
      case "4":
        return <RentalShop />;
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <AuthGuard>
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
                editProfileForm?.cover_photo ?? "/images/profile_bg.png"
              })`,
            }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3">
              <Avatar
                size={153}
                alt="profile pic"
                src={editProfileForm.profile_photo ?? "/images/profile.png"}
              />
            </div>
            <span className="hidden">
              <Widget
                value={editProfileForm?.cover_photo as any}
                doNotStore={false}
                onDialogClose={async (info: any) => {
                  const url = (await info.promise()).cdnUrl;
                  setEditProfileForm((p) => ({ ...p, cover_photo: url }));
                }}
                imagesOnly={true}
                multiple={false}
                ref={coverRef}
                publicKey={`${process.env.NEXT_PUBLIC_UPLOAD_CARE_KEY}`}
                previewStep={true}
              />
            </span>
            <span className="hidden">
              <Widget
                value={editProfileForm?.profile_photo as any}
                doNotStore={false}
                onDialogClose={async (info: any) => {
                  const url = (await info.promise()).cdnUrl;
                  setEditProfileForm((p) => ({ ...p, profile_photo: url }));
                }}
                imagesOnly={true}
                multiple={false}
                ref={profileRef}
                publicKey={`${process.env.NEXT_PUBLIC_UPLOAD_CARE_KEY}`}
                previewStep={true}
              />
            </span>
            <button
              onClick={() => coverRef?.current?.openDialog("")}
              className="w-10 h-10 rounded-full bg-gray-300 text-black text-xl grid place-items-center absolute bottom-0 right-0"
            >
              <RiImageEditFill />
            </button>
            <button
              onClick={() => profileRef?.current?.openDialog("")}
              className="w-10 h-10 rounded-full bg-gray-300 text-xl text-black grid place-items-center absolute -bottom-10 right-[44%]"
            >
              <RiImageEditFill />
            </button>
          </div>
          <h3 className="mt-[88px] font-lota text-lg text-center text-[#23262F]">
            Videographer by day, night watcher by night
          </h3>
          <Tabs
            className="profile-tabs mt-[121px]"
            onChange={setActiveTab}
            activeKey={activeTab}
          >
            <TabPane key={"1"} tab="Edit Profile">
              <EditProfile
                onSave={() =>
                  upsertProfile({
                    variables: { ...editProfileForm, userId: user?.id },
                  })
                }
                data={editProfileForm}
                onChange={handleOnChangeInput}
                loading={loading}
              />
            </TabPane>
            <TabPane key={"2"} tab="See Activities">
              <Activities />
            </TabPane>
            <TabPane key={"3"} tab="Settings">
              <Settings />
            </TabPane>
            <TabPane key={"4"} tab="Rental Shop"></TabPane>
            <TabPane key={"5"} tab="Review">
              <Review />
            </TabPane>
          </Tabs>
        </section>
        {getActiveTab}
      </main>
      <Footer />
    </AuthGuard>
  );
};

export default Profile;
