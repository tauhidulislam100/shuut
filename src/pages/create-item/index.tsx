import React, { useState } from "react";
import {
  Footer,
  GeneralInfo,
  Insurance,
  Location,
  NavBar,
} from "../../components";
import { BsArrowLeftCircle } from "react-icons/bs";
import AuthGuard from "../../components/auth-guard/AuthGuard";
import { useMutation, useQuery } from "@apollo/client";
import {
  CreateListingMutation,
  GetAllCategoryQuery,
  GET_ALL_BANKS,
} from "../../graphql/query_mutations";
import { notification } from "antd";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import { format } from "date-fns";

const NewListing = () => {
  const router = useRouter();
  const { user, refetchCurrentUser } = useAuth();
  const { data: categoryList } = useQuery(GetAllCategoryQuery);
  const { data: bankList } = useQuery(GET_ALL_BANKS);
  const [step, setStep] = useState<number>(0);
  const [isInvalidForm, setIsInvalidForm] = useState(false);
  const [listingForm, setListingForm] = useState({
    title: "",
    categoryId: null,
    description: "",
    location: null,
    price: 0,
    quantity: 1,
    min_rental_days: 1,
    daily_price: 0,
    weekly_price: 0,
    monthly_price: 0,
    availability_exceptions: [],
    is_always_available: false,
    delivery_option: "",
    images: [],
    accept_insurance: false,
    accept_terms: false,
    user_id: user?.id,
    address_id: null,
    bank_id: user?.bank_account?.bank_id,
    account_number: user?.bank_account?.account_number,
  });
  const [createListing, { loading }] = useMutation(CreateListingMutation, {
    onCompleted: (data) => {
      refetchCurrentUser?.();
      if (user?.verified) {
        router.push(`/listed/${data.listing.slug}`);
      } else {
        router.push(`/kyc`);
      }
    },
    onError: (error) => {
      notification.error({
        message: error.message,
      });
    },
  });

  const handleNext = (nextStep: number) => {
    setIsInvalidForm(false);
    if (nextStep === 1) {
      if (
        !listingForm.title ||
        listingForm.images.length < 1 ||
        !listingForm.categoryId ||
        !listingForm.location ||
        !listingForm.price ||
        !listingForm.daily_price
      ) {
        setIsInvalidForm(true);
        return;
      }
    }

    if (nextStep == 2) {
      if (!listingForm.address_id || !listingForm.accept_terms) {
        setIsInvalidForm(true);
        return;
      }
    }
    setStep(nextStep);
  };

  const onChange = (name: string, value: any) => {
    setListingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnSubmit = async () => {
    setIsInvalidForm(false);
    if (
      !listingForm.accept_insurance ||
      !listingForm.account_number ||
      !listingForm.bank_id
    ) {
      setIsInvalidForm(true);
      return;
    }
    await createListing({
      variables: {
        ...listingForm,
        availability_exceptions: listingForm.availability_exceptions.map(
          (v: any) => ({
            from: format(v.from, "yyyy-MM-dd"),
            to: format(v.to, "yyyy-MM-dd"),
          })
        ),
      },
    });
  };

  return (
    <AuthGuard>
      <NavBar />
      <div className="border-b"></div>
      <main className="container mt-5">
        <div className="">
          {step === 0 ? (
            <button
              onClick={() => router.back()}
              className="text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center"
            >
              <span className="mr-2 text-secondary">
                <BsArrowLeftCircle />
              </span>
              back
            </button>
          ) : null}
        </div>
        <div className="lg:px-[10%] create-listing">
          <h1 className="mt-[74px] text-[32px] font-lota font-semibold text-primary">
            New Listings
          </h1>
          {step === 0 ? (
            <GeneralInfo
              onChange={onChange}
              data={listingForm}
              isInvalid={isInvalidForm}
              categories={categoryList?.category ?? []}
              onSubmit={() => handleNext(1)}
            />
          ) : step === 1 ? (
            <Location
              data={listingForm}
              onChange={onChange}
              isInvalid={isInvalidForm}
              onSubmit={() => handleNext(2)}
              onCancel={() => setStep(0)}
            />
          ) : step === 2 ? (
            <Insurance
              isInvalid={isInvalidForm}
              data={listingForm}
              banks={bankList?.banks}
              onChange={onChange}
              onSubmit={handleOnSubmit}
              onCancel={() => setStep(1)}
              loading={loading}
            />
          ) : null}
        </div>
      </main>
      <Footer />
    </AuthGuard>
  );
};

export default NewListing;
