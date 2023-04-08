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
import { Avatar, notification, Spin, Tabs } from "antd";
import AuthGuard from "../../components/auth-guard/AuthGuard";
import { useAuth } from "../../hooks/useAuth";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_ADDRESS,
  GET_USER_INFO_BY_ID,
  UPDATE_COVER_PHOTO,
  UPDATE_PROFILE_PHOTO,
  UPDTAE_ADDRESS,
  UPSERT_PROFILE,
} from "../../graphql/query_mutations";
import { Widget, WidgetAPI } from "@uploadcare/react-widget";
import { RiImageEditFill } from "react-icons/ri";
import router from "next/router";
import Back from "../../components/Back";

const { TabPane } = Tabs;

const Profile = () => {
  const [activeTab, setActiveTab] = useState<string>("4");
  const profileRef = useRef<WidgetAPI | null>(null);
  const coverRef = useRef<WidgetAPI | null>(null);
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [photoUpdate, setPhotoUpdate] = useState({
    profileLoading: false,
    coverLoading: false,
  });
  const [editProfileForm, setEditProfileForm] = useState({
    cover_photo: null,
    description: "",
    advance: 0,
    business_name: "",
    opening_hours: "",
    closing_hours: "",
    store_location: "",
    firstName: "",
    lastName: "",
    phone: "",
    profile_photo: null,
  });
  const [address, setAddress] = useState<Record<string, any>>({});
  const { data: profileData } = useQuery(GET_USER_INFO_BY_ID, {
    fetchPolicy: "cache-and-network",
    variables: {
      id: user?.id,
    },
  });

  const [upsertProfile, { loading }] = useMutation(UPSERT_PROFILE, {
    onError: (error) => {
      notification.error({
        message: error.message,
      });
    },
    onCompleted(data) {
      console.log("data: ", data);
      notification.success({
        message: "Profile update success",
      });
      setEditMode(false);
    },
  });
  const [createAddress, { loading: createAddressLoading }] = useMutation(
    CREATE_ADDRESS,
    {
      onCompleted() {},
      onError(error) {
        notification.error({
          message: error?.message,
        });
      },
    }
  );
  const [updateAddress, { loading: updateLoading }] = useMutation(
    UPDTAE_ADDRESS,
    {
      onCompleted() {},
      onError(error) {
        notification.error({
          message: error?.message,
        });
      },
    }
  );

  const [updatePorfilePhoto] = useMutation(UPDATE_PROFILE_PHOTO, {
    onError(err) {
      notification.error({
        message: err.message,
      });
    },
  });

  const [updateCoverPhoto] = useMutation(UPDATE_COVER_PHOTO, {
    onError(err) {
      notification.error({
        message: err.message,
      });
    },
  });

  useEffect(() => {
    if (profileData) {
      const { profile, addresses, firstName, lastName, profile_photo, phone } =
        profileData.userInfo;
      setEditProfileForm((prev) => ({
        ...prev,
        ...profile,
        firstName,
        lastName,
        profile_photo,
        phone,
      }));

      if (addresses?.find((a: Record<string, any>) => a.is_default)) {
        setAddress(addresses?.find((a: Record<string, any>) => a.is_default));
      } else {
        setAddress(addresses?.[0]);
      }
    }
  }, [profileData]);

  const handleOnChangeInput = (name: string, value: string) => {
    setEditProfileForm((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const onChangeAddressInput = (name: string, value: string) => {
    setAddress((p) => ({
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

  const onSave = async () => {
    const { id, ...rest } = address;

    if (id) {
      await Promise.all([
        updateAddress({
          variables: {
            ...rest,
            id: id,
            is_default: true,
          },
        }),
        upsertProfile({
          variables: { ...editProfileForm, userId: user?.id },
        }),
      ]);
    } else {
      await Promise.all([
        createAddress({
          variables: {
            first_name: editProfileForm.firstName,
            last_name: editProfileForm.lastName,
            ...rest,
            is_default: true,
          },
        }),
        upsertProfile({
          variables: { ...editProfileForm, userId: user?.id },
        }),
      ]);
    }
  };

  return (
    <AuthGuard>
      <NavBar />
      <Back />
      <main className="container mt-5">
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
                onFileSelect={(file: any) => {
                  if (file) {
                    setPhotoUpdate((p) => ({ ...p, coverLoading: true }));
                    file.done(async ({ cdnUrl }: any) => {
                      setEditProfileForm((p) => ({
                        ...p,
                        cover_photo: cdnUrl,
                      }));
                      await updateCoverPhoto({
                        variables: {
                          userId: user?.id,
                          url: cdnUrl,
                        },
                      });
                      setPhotoUpdate((p) => ({ ...p, coverLoading: false }));
                    });
                  }
                }}
                doNotStore={false}
                imagesOnly={true}
                multiple={false}
                ref={coverRef}
                publicKey={`${process.env.NEXT_PUBLIC_UPLOAD_CARE_KEY}`}
                previewStep={true}
              />
            </span>
            <span className="hidden">
              <Widget
                onFileSelect={(file: any) => {
                  if (file) {
                    setPhotoUpdate((p) => ({ ...p, profileLoading: true }));
                    file.done(async ({ cdnUrl }: any) => {
                      setEditProfileForm((p) => ({
                        ...p,
                        profile_photo: cdnUrl,
                      }));
                      await updatePorfilePhoto({
                        variables: {
                          userId: user?.id,
                          url: cdnUrl,
                        },
                      });
                      setPhotoUpdate((p) => ({ ...p, profileLoading: false }));
                    });
                  }
                }}
                doNotStore={false}
                imagesOnly={true}
                multiple={false}
                ref={profileRef}
                publicKey={`${process.env.NEXT_PUBLIC_UPLOAD_CARE_KEY}`}
                previewStep={true}
              />
            </span>
            <button
              onClick={() => coverRef?.current?.openDialog("")}
              className={`w-10 h-10 rounded-full bg-gray-300 text-black text-xl grid place-items-center absolute bottom-0 right-0 ${
                photoUpdate.coverLoading ? "animate-spin" : ""
              }`}
            >
              <RiImageEditFill />
            </button>
            <button
              onClick={() => profileRef?.current?.openDialog("")}
              className={`w-10 h-10 rounded-full bg-gray-300 text-xl text-black grid place-items-center absolute -bottom-10 xl:right-[44%] md:right-[40%] right-[32%] ${
                photoUpdate.profileLoading ? "animate-spin" : ""
              }`}
            >
              <RiImageEditFill />
            </button>
          </div>
          <h3 className="mt-[88px] font-lota text-lg text-center text-[#23262F]">
            {editProfileForm?.description}
          </h3>
          <Tabs
            className="profile-tabs sm:mt-[121px]"
            onChange={setActiveTab}
            activeKey={activeTab}
            tabPosition="top"
          >
            <TabPane key={"1"} tab="My profile">
              {!editMode ? (
                <div className="bg-[#FCFCFD] border border-[#DFDFE6] rounded-[10px] p-4">
                  <div className="flex justify-end mb-4">
                    <button
                      className="font-semibold font-lota text-primary hover:text-secondary"
                      onClick={() => setEditMode(true)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex justify-between items-start mb-4 last:mb-0">
                    <strong>Name:</strong>
                    <span>
                      {editProfileForm.firstName} {editProfileForm?.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between items-start mb-4 last:mb-0">
                    <strong>Email Address:</strong>
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex justify-between items-start mb-4 last:mb-0">
                    <strong>Phone Number:</strong>
                    <span>{editProfileForm?.phone}</span>
                  </div>
                  <div className="flex justify-between items-start mb-4 last:mb-0">
                    <strong>Address:</strong>
                    <span>{address?.delivery_address}</span>
                  </div>
                  <div className="flex justify-between items-start mb-4 last:mb-0">
                    <strong>Business Name:</strong>
                    <span>{editProfileForm.business_name}</span>
                  </div>
                  <div className="flex justify-between items-start mb-4 last:mb-0">
                    <strong>Store Location:</strong>
                    <span>{user?.phone}</span>
                  </div>
                  <div className="flex justify-between items-start mb-4 last:mb-0">
                    <strong>Opening Hours:</strong>
                    <span>{editProfileForm?.opening_hours}</span>
                  </div>
                  <div className="flex justify-between items-start mb-4 last:mb-0">
                    <strong>Closing Hours:</strong>
                    <span>{editProfileForm.closing_hours}</span>
                  </div>
                  <div className="flex justify-between items-start mb-4 last:mb-0">
                    <strong>Descrption:</strong>
                    <span>{editProfileForm.description}</span>
                  </div>
                </div>
              ) : (
                <EditProfile
                  onCancel={() => setEditMode(false)}
                  onSave={onSave}
                  data={editProfileForm}
                  onChange={handleOnChangeInput}
                  onChangeAddress={onChangeAddressInput}
                  loading={loading || updateLoading || createAddressLoading}
                  address={address}
                />
              )}
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
