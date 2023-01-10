import { useMutation, useQuery } from "@apollo/client";
import { notification, Spin } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { NavBar } from "../components";
import AuthGuard from "../components/auth-guard/AuthGuard";
import CartProduct, { CARTITEM } from "../components/products/CartProduct";
import { DELETE_CART_ITEM, GET_CART_ITEMS } from "../graphql/query_mutations";
import { useAuth } from "../hooks/useAuth";
import { useGlobalState } from "../hooks/useGlobalState";

const Cart: NextPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { checkoutItems, updateCheckoutItems } = useGlobalState();
  const { loading, error, refetch } = useQuery(GET_CART_ITEMS, {
    variables: {
      userId: user?.id,
    },
    onCompleted(data) {
      if (data) {
        setCartItems(data.cartItems);
      }
    },
    fetchPolicy: "cache-and-network",
  });
  const [deleteCartItem, { loading: deleteLoading }] = useMutation(
    DELETE_CART_ITEM,
    {
      onError(error) {
        notification.error({
          message: error.message,
        });
      },
      onCompleted(data) {
        refetch({
          userId: user?.id,
        });
      },
    }
  );
  const [cartItems, setCartItems] = useState<CARTITEM[]>([]);

  return (
    <AuthGuard>
      <div className="bg-[#F8FAFC] min-h-screen">
        <NavBar />
        <div className="container">
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
          <div className="mt-20">
            <div className="flex items-center">
              <h1 className="font-lota text-[32px] font-semibold">Cart</h1>
              {cartItems?.length ? (
                <button
                  onClick={() => {
                    if (cartItems.length === checkoutItems.length) {
                      updateCheckoutItems?.(undefined, []);
                    } else {
                      updateCheckoutItems?.(
                        undefined,
                        cartItems.map((item) => item.id) as any
                      );
                    }
                  }}
                  className="ml-4 text-secondary"
                >
                  {cartItems.length === checkoutItems.length
                    ? "Deselect"
                    : "Select"}{" "}
                  All
                </button>
              ) : null}
            </div>
            {error ? (
              <div className="text-red-500 bg-red-100 p-3 text-center my-2">
                {error.message}
              </div>
            ) : null}
            {deleteLoading || loading ? (
              <div className="h-[50vh] w-full flex items-center justify-center">
                <Spin size="large" />
              </div>
            ) : (
              <div className="grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2  gap-5 mt-[30px]">
                {cartItems?.map((item) => (
                  <CartProduct
                    item={item}
                    key={`cart_product_${item?.id}`}
                    onDelete={() =>
                      deleteCartItem({ variables: { id: item.id } })
                    }
                  />
                ))}
              </div>
            )}

            <div className="flex justify-center mt-[60px] mb-10">
              {cartItems.length ? (
                <button
                  onClick={() => router.push("/transaction-summary")}
                  disabled={!checkoutItems.length}
                  className=" disabled:bg-gray-500 bg-secondary hover:bg-primary h-[48px] w-[193px]  !text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg"
                >
                  CheckOut
                </button>
              ) : (
                <div className="text-center">
                  <h3 className="font-semibold text-black font-sofia-pro text-lg">
                    Your Cart is empty
                  </h3>
                  <Link href={"/listings/search"}>
                    <a className="bg-primary h-[48px]  !text-white hover:text-white text-lg px-4 my-2 rounded-md inline-flex items-center">
                      Add Items To Cart
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Cart;
