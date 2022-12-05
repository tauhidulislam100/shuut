import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { notification, Spin } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { NavBar } from "../components";
import AuthGuard from "../components/auth-guard/AuthGuard";
import CartProduct, { CARTITEM } from "../components/products/CartProduct";
import { DELETE_CART_ITEM, GET_CART_ITEMS } from "../graphql/query_mutations";
import { useAuth } from "../hooks/useAuth";

const Cart: NextPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { loading, error, refetch } = useQuery(GET_CART_ITEMS, {
    variables: {
      userId: user?.id,
    },
    onCompleted(data) {
      if (data.cart && data.cart.length) {
        setCartItems(data.cart[0]["cartItems"]);
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
            <h1 className="font-lota text-[32px] font-semibold">Cart</h1>
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
              <div className="grid md:grid-cols-5 gap-5 mt-[30px]">
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
                <Link href={"/transaction-summary"}>
                  <a className=" bg-secondary hover:bg-primary h-[48px] w-[193px]  !text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                    CheckOut
                  </a>
                </Link>
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
