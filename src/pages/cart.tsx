import { NextPage } from "next";
import React from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { NavBar } from "../components";
import CartProduct from "../components/products/CartProduct";
const Cart:NextPage = () => {

    return (
        <div className="bg-[#F8FAFC] min-h-screen">
            <div className="container">
                <NavBar />
                <div className="">
                    <button className='text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center'>
                        <span className='mr-2 text-secondary'><BsArrowLeftCircle /></span>
                        back
                    </button>
                </div>
                <div className="mt-20">
                    <h1 className="font-lota text-[32px] font-semibold">Cart</h1>
                    <div className="grid md:grid-cols-5 gap-5 mt-[30px]">
                        {
                            Array(5).fill('').map((_,idx) => <CartProduct key={`cart_product_${idx}`} />)
                        }
                    </div>
                    <div className="flex justify-center mt-[60px] mb-10">
                        <button className=" bg-secondary hover:bg-primary h-[48px] w-[193px]  !text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                            List An Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Cart;