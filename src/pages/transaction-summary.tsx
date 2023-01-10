import React, { useEffect, useRef, useState } from "react";
import { Footer, NavBar } from "../components";
import { BsArrowLeftCircle } from "react-icons/bs";
import { notification, Rate, Row, Spin } from "antd";
import { useRouter } from "next/router";
import AuthGuard from "../components/auth-guard/AuthGuard";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  ADD_TO_CART,
  CONFIRM_TRANSACTION,
  CREATE_TRANSACTION,
  DELETE_CART_ITEM,
  GET_MY_ADDRESSES,
  GET_TRANSACTION_SUMMARY,
} from "../graphql/query_mutations";
import Link from "next/link";
import { PaystackButton } from "react-paystack";
import { useAuth } from "../hooks/useAuth";
import paymentAnimation from "../components/lottie/payment-success.json";
import Lottie from "lottie-react";
import useAsyncEffect from "use-async-effect";
import { turnicate } from "../utils/utils";
import { differenceInCalendarDays } from "date-fns";
import AddressForm from "../components/listing/AddressForm";
import { useGlobalState } from "../hooks/useGlobalState";
import { FaTimes } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";
import { AiOutlineCloseCircle } from "react-icons/ai";

export const PayButton = ({
  amount = 0,
  email = "",
  onSuccess,
  onClose,
  loading,
}: {
  email: string;
  onSuccess: (data?: any) => void;
  onClose: () => void;
  loading?: boolean;
  amount: number;
}) => {
  const config = {
    text: loading ? "Confirming..." : "Make Payment",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    email: email as string,
    amount: Math.round(amount * 100),
    className:
      "w-[193px] font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold",
    onSuccess: onSuccess,
    onClose: onClose,
  };
  return <PaystackButton {...config} />;
};

const Payment = () => {
  const ref = useRef<boolean>();
  const router = useRouter();
  const { user } = useAuth();
  const { checkoutItems, updateCheckoutItems } = useGlobalState();
  const [completeTransaction, setCompleteTransaction] = useState(false);
  const [transactionSummary, setTransactionSummary] =
    useState<Record<string, any>>();
  const [selectedAddress, setSelectedAddress] = useState<Record<string, any>>();
  const [
    getSummary,
    { loading: summaryLoading, error, data: transactionData },
  ] = useLazyQuery(GET_TRANSACTION_SUMMARY, {
    variables: {
      bookings: checkoutItems,
    },
  });
  const [addToCart, { loading: cartInProgress }] = useMutation(ADD_TO_CART, {
    onError: (error) => {
      notification.error({
        message: error.message,
      });
    },
    onCompleted(data) {
      getSummary({
        fetchPolicy: "network-only",
      });
    },
  });
  const [confirmTransaction, { loading: confirmTransactionLoading }] =
    useMutation(CONFIRM_TRANSACTION, {
      onCompleted(data) {
        setCompleteTransaction(true);
      },
      onError(error) {
        notification.error({
          message: error.message,
        });
      },
    });

  const [createTransaction, { loading: creatingTransaction }] =
    useMutation(CREATE_TRANSACTION);

  useEffect(() => {
    if (transactionData) {
      setTransactionSummary(transactionData.summary);
    }
  }, [transactionData]);

  useAsyncEffect(
    async (isMounted) => {
      if (isMounted() && router && !ref.current) {
        ref.current = true;
        await getSummary({
          fetchPolicy: "cache-and-network",
        });
        const { start, end, quantity, listingId, pricing_option } =
          router.query;
        if (listingId && start && end) {
          await addToCart({
            variables: {
              start,
              end,
              quantity: quantity ?? 1,
              listing_id: listingId,
              pricing_option,
            },
          });
        }
      }
    },
    [router, ref]
  );

  const onPaymentSuccess = (resources?: any) => {
    createTransaction({
      variables: {
        payinTotal: transactionData.summary.total,
        userId: user?.id,
        address: `${selectedAddress?.delivery_address},${
          selectedAddress?.city
        },${selectedAddress?.state} ${selectedAddress?.country ?? ""}`,
      },
      onCompleted(data) {
        confirmTransaction({
          variables: {
            transaction_id: data.transaction.id,
            amount: transactionData.summary.total,
            status: resources.status,
            reference: resources.reference,
            bookings: checkoutItems,
          },
        });
      },
      onError(err) {
        notification.error({
          message: err.message,
        });
      },
    });
  };

  const onClose = (e?: any) => {
    console.log("close: ", e);
  };

  return (
    <AuthGuard>
      <NavBar />
      <div className="border-b"></div>
      <main className="container mt-5 mb-5">
        <div className="">
          <button
            onClick={() => router.back()}
            className="text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center"
          >
            <span className="mr-2 text-secondary">
              <BsArrowLeftCircle />
            </span>
            back
          </button>
        </div>
        {completeTransaction ? (
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-green-400 my-2 font-medium text-lg font-sofia-pro">
              Order Placed
            </h3>
            <Lottie
              animationData={paymentAnimation}
              loop={false}
              style={{ height: 350 }}
            />
            {user?.verified ? (
              <Link href={"/profile?tab=rentals"}>
                <a className="text-secondary font-medium text-base">
                  Go Rentals
                </a>
              </Link>
            ) : (
              <Link href={"/kyc"}>
                <a className="text-secondary font-medium text-base">
                  Verify Your Account
                </a>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-6 grid-cols-1 gap-6 mt-20">
            <div className="2xl:col-span-4 lg:col-span-3 lg:order-1 order-2">
              {summaryLoading && !ref.current ? (
                <div className="flex items-center justify-center">
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  <AddressForm
                    buttonText="Save & Continue"
                    selectedAddress={selectedAddress}
                    onChange={(addr) => {
                      setSelectedAddress(addr);
                    }}
                  />
                  {selectedAddress && transactionSummary ? (
                    <div className="mt-6 flex justify-end xs:gap-5 gap-3">
                      <button
                        onClick={() => router.push("/listings/search")}
                        className="w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold"
                      >
                        Cancel
                      </button>
                      <PayButton
                        email={user?.email as string}
                        amount={+transactionSummary?.total}
                        loading={
                          confirmTransactionLoading || creatingTransaction
                        }
                        onSuccess={onPaymentSuccess}
                        onClose={onClose}
                      />
                    </div>
                  ) : null}
                </>
              )}
            </div>
            <div className="2xl:col-span-2 lg:col-span-3 lg:order-2 order-1">
              {error ? (
                <div className="w-[60%] mx-auto bg-red-100 rounded-md block text-red-500 font-medium text-sm p-4 mt-2">
                  {error.message}
                </div>
              ) : null}
              {summaryLoading || cartInProgress ? (
                <div className="flex items-center justify-center">
                  <Spin size="large" />
                </div>
              ) : null}
              {transactionSummary && transactionSummary?.items?.length ? (
                <>
                  <div className="">
                    <div className="bg-[#FCFCFD] border bg-[] p-4 sm:px-4 px-2 border-[#DFDFE6] rounded-[5px]">
                      <div className="flex justify-between items-center">
                        <h3 className="font-lota font-semibold text-lg sm:text-xl text-primary">
                          Orders
                        </h3>
                      </div>
                      {transactionSummary?.items?.map(
                        (transactionItem: Record<string, any>) => (
                          <div key={"key"} className="mt-4">
                            <div className="mt-10">
                              {transactionItem.listings.map(
                                (listing: Record<string, any>) => (
                                  <div
                                    key={listing.listingId}
                                    className="p-5 sm:px-5 px-2 border-b flex justify-between items-center text-lg sm:text-xl md:text-2xl"
                                  >
                                    <div className="flex">
                                      <div className="relative rounded-sm">
                                        <div className="rounded-lg drop-shadow-lg relative">
                                          <button
                                            className="absolute -left-2 -top-2 text-red-500"
                                            onClick={() => {
                                              updateCheckoutItems?.(
                                                listing.bookingId
                                              );
                                              setTransactionSummary((p) => ({
                                                ...p,
                                                items: [
                                                  ...p?.items.filter(
                                                    (item: any) =>
                                                      item.bookingId !==
                                                      listing.bookingId
                                                  ),
                                                ],
                                              }));
                                            }}
                                          >
                                            <AiOutlineCloseCircle />
                                          </button>
                                          <img
                                            src={listing?.images?.[0]?.url}
                                            alt={listing.title}
                                            width={110}
                                            height={132}
                                            className="object-cover rounded-lg"
                                          />
                                        </div>
                                        <div className="absolute -top-1 flex justify-center items-center -right-1 w-5 h-5 rounded-full p-2 text-xs text-primary shadow bg-white">
                                          {listing.quantity}
                                        </div>
                                      </div>
                                      <div className="pl-2 font-lota">
                                        <h4 className="text-primary-100 sm:pt-3 font-normal text-2xl xxs:text-base">
                                          {turnicate(listing.title, 8)}
                                        </h4>
                                        <p className="text-[#677489] mt-3 text-2xl xxs:text-base font-normal">
                                          Duration:{" "}
                                          <span className="text-primary-100">
                                            {differenceInCalendarDays(
                                              new Date(listing.to),
                                              new Date(listing.from)
                                            )}
                                            days
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="ml-auto">
                                      <h4 className="font-lota text-2xl text-primary xxs:text-base">
                                        ₦{listing.price}
                                      </h4>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                            <div className="py-7 border-b text-xl font-lota">
                              <h4 className="">
                                <span className="text-[#677489]">Owner </span>
                                {transactionItem?.user?.firstName}
                              </h4>
                              <div className="flex items-center">
                                <Rate
                                  count={5}
                                  className="text-base"
                                  value={transactionItem?.user?.reviews?.rating}
                                  disabled
                                />

                                <span className="text-[#286EE6] text-lg font-normal ml-1 mt-2 inline-block">
                                  {transactionItem?.user?.reviews?.total}{" "}
                                  reviews
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                      <div className="text-xl font-lota py-7 border-b">
                        <div className="flex justify-between">
                          <h4 className="text-[#677489]">Total Rental Fee</h4>
                          <p className="">
                            ₦{transactionSummary?.serviceCharge}
                          </p>
                        </div>
                        <div className="flex justify-between mt-3">
                          <h4 className="text-[#677489]">Vat</h4>
                          <p className="">₦{transactionSummary?.vat}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-7 text-xl">
                        <h4 className="">Total</h4>
                        <p className="text-[#4436AC] font-semibold">
                          ₦{transactionSummary?.total}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="font-lota"></div>
                </>
              ) : !summaryLoading ? (
                <div className="h-[20vh] w-full flex flex-col items-center justify-center">
                  <h4 className="text-lg font-sofia-pro text-primary">
                    looks like your cart is empty
                  </h4>
                  <p className="text-base font-normal font-sofia-pro">
                    <Link href={"/listings/search"}>
                      <a className="text-secondary">Discover listings</a>
                    </Link>
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </AuthGuard>
  );
};

export default Payment;
