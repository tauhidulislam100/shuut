import React, { useEffect, useRef, useState } from "react";
import { Footer, NavBar } from "../components";
import { BsArrowLeftCircle } from "react-icons/bs";
import {
  Checkbox,
  Col,
  Form,
  Input,
  notification,
  Rate,
  Row,
  Spin,
} from "antd";
import { useRouter } from "next/router";
import AuthGuard from "../components/auth-guard/AuthGuard";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  ADD_TO_CART,
  CONFIRM_TRANSACTION,
  CREATE_PAYMENT,
  GET_TRANSACTION_SUMMARY,
} from "../graphql/query_mutations";
import Link from "next/link";
import { PaystackButton } from "react-paystack";
import { useAuth } from "../hooks/useAuth";
import paymentAnimation from "../components/lottie/payment-success.json";
import Lottie from "lottie-react";
import useAsyncEffect from "use-async-effect";

const PayButton = ({
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
    text: loading ? "Confirming..." : "MakePayment",
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
  const [completeTransaction, setCompleteTransaction] = useState(false);
  const [transactionSummary, setTransactionSummary] =
    useState<Record<string, any>>();
  const [getSummary, { loading, error, data: transactionData }] = useLazyQuery(
    GET_TRANSACTION_SUMMARY
  );
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
  const [createPayment, { loading: createPaymentLoading }] = useMutation(
    CREATE_PAYMENT,
    {
      onError(error) {
        notification.error({
          message: error.message,
        });
      },
      onCompleted(data) {
        confirmTransaction({
          variables: {
            id: transactionData.summary.transactionId,
            paymentId: data.result.id,
            payinTotal: transactionData.summary.total,
          },
        });
      },
    }
  );

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
        const { start, end, quantity, listingId } = router.query;
        if (listingId && start && end) {
          await addToCart({
            variables: {
              start,
              end,
              quantity: quantity ?? 1,
              listing_id: listingId,
            },
          });
        }
      }
    },
    [router, ref]
  );
  const onPaymentSuccess = (resources?: any) => {
    createPayment({
      variables: {
        amount: transactionData.summary.total,
        status: resources.status,
        reference: resources.reference,
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
        {error ? (
          <div className="w-[60%] mx-auto bg-red-100 rounded-md block text-red-500 font-medium text-sm p-4 mt-2">
            {error.message}
          </div>
        ) : null}
        {loading || cartInProgress ? (
          <div className="flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : null}
        {transactionSummary ? (
          <>
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
                <Link href={"/"}>
                  <a className="text-secondary font-medium text-base">
                    Go Home
                  </a>
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-20">
                  <h1 className="text-lg sm:text-[32px] font-semibold text-primary font-lota">
                    Transaction Summary
                  </h1>
                  <div className="mt-7 bg-[#FCFCFD] border bg-[] py-9 px-10 border-[#DFDFE6] rounded-[5px]">
                    <div className="flex justify-between items-center">
                      <h3 className="font-lota font-semibold text-lg sm:text-xl text-primary">
                        Order Summary
                      </h3>
                      <h4 className="font-lota text-lg sm:text-2xl text-primary">
                        ₦{transactionSummary?.total}
                      </h4>
                    </div>
                    {transactionSummary?.items?.map(
                      (transactionItem: Record<string, any>) => (
                        <div key={"key"} className="mt-4">
                          <div className="border rounded-[5px] mt-10 bg-[#F8FAFC]">
                            {transactionItem.listings.map(
                              (listing: Record<string, any>) => (
                                <div
                                  key={listing.listingId}
                                  className="p-5 border-b flex justify-between text-lg sm:text-xl md:text-2xl"
                                >
                                  <div className="flex">
                                    <div className="relative rounded-sm">
                                      <div className="rounded-lg drop-shadow-lg">
                                        <img
                                          src={listing?.images?.[0]?.url}
                                          alt={listing.title}
                                          width={124}
                                          height={124}
                                          className="object-cover rounded-lg"
                                        />
                                      </div>
                                      <div className="absolute -top-1 flex justify-center items-center -right-1 w-5 h-5 rounded-full p-2 text-xs text-primary shadow bg-white">
                                        {listing.quantity}
                                      </div>
                                    </div>
                                    <div className="pl-7 font-lota">
                                      <h4 className="text-primary-100 sm:pt-3">
                                        {listing.title}
                                      </h4>
                                      {/* <p className="text-[#677489] mt-3">
                            Color: <span className="text-primary-100">Black</span>
                          </p> */}
                                    </div>
                                  </div>
                                  <div className="">
                                    <h4 className="font-lota sm:text-2xl text-primary">
                                      ₦{listing.price}
                                    </h4>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                          <div className="sm:flex justify-between items-center py-7 border-b text-lg sm:text-2xl font-lota">
                            <div className="">
                              <h4 className="">
                                <span className="text-[#677489]">Owner </span>
                                {transactionItem?.user?.firstName}
                              </h4>
                            </div>
                            <div className="">
                              <Rate defaultValue={4.5} disabled />
                              <span className="text-[#286EE6]">17 reviews</span>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    <div className="sm:text-[27px] font-lota py-7 border-b">
                      <div className="flex justify-between">
                        <h4 className="text-[#677489]">Total Rental Fee</h4>
                        <p className="">₦{transactionSummary?.serviceCharge}</p>
                      </div>
                      <div className="flex justify-between mt-3">
                        <h4 className="text-[#677489]">Vat</h4>
                        <p className="">₦{transactionSummary?.vat}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-7 sm:text-[27px]">
                      <h4 className="">Total</h4>
                      <p className="text-[#4436AC] font-semibold">
                        ₦{transactionSummary?.total}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="font-lota">
                  {/* <h1 className="text-xl sm:text-[32px] text-[#111729] mt-12">
                Payment
              </h1> */}
                  <div className="border mt-7 p-10 rounded-[5px] bg-[#FCFCFD]">
                    {/* <h3 className="font-lota font-semibold text-lg sm:text-xl mb-10">
                  Payment Methods
                </h3>
                <Form wrapperCol={{ span: 24 }} labelCol={{ span: 24 }}>
                  <Form.Item label="Card holder name">
                    <Input placeholder="John Doe" />
                  </Form.Item>
                  <Form.Item label="Billing address">
                    <Input placeholder="Nigeria" />
                  </Form.Item>
                  <Row gutter={200}>
                    <Col span={24} md={12}>
                      <Form.Item label="Zip code">
                        <Input placeholder="Ex. 73923" />
                      </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                      <Form.Item label="City">
                        <Input placeholder="Ex. Victoria Islan" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item className="flex">
                    <Checkbox>Billing address is same as shipping</Checkbox>
                  </Form.Item>
                </Form> */}
                    <div className="mt-6 flex justify-end gap-5">
                      <button
                        onClick={() => router.push("/listings/search")}
                        className="w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold"
                      >
                        Cancel
                      </button>
                      <PayButton
                        email={user?.email as string}
                        amount={+transactionSummary.total}
                        loading={
                          confirmTransactionLoading || createPaymentLoading
                        }
                        onSuccess={onPaymentSuccess}
                        onClose={onClose}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : !loading ? (
          <div className="h-[50vh] w-full flex flex-col items-center justify-center">
            <h4 className="text-lg font-sofia-pro text-primary">
              No Items Found
            </h4>
            <p className="text-base font-normal font-sofia-pro">
              <Link href={"/listings/search"}>
                <a className="text-secondary">Discover listings</a>
              </Link>
            </p>
          </div>
        ) : null}
      </main>
      <Footer />
    </AuthGuard>
  );
};

export default Payment;
