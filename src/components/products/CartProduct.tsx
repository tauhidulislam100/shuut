import React from "react";
import { FiHeart } from "react-icons/fi";
import { Niger } from "../icons";
import RattingBar from "../ratting-bar/RattingBar";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useGlobalState } from "../../hooks/useGlobalState";
import Link from "next/link";
import { useRouter } from "next/router";

export interface CARTITEM {
  id: string;
  quantity?: number;
  listing?: {
    id: number;
    title: string;
    slug: string;
    daily_price: number;
    location_name: string;
    images?: { url: string; id: number }[];
    user?: {
      id: number;
      firstName: string;
      lastName: string;
    };
  };
}
interface IProps {
  item?: CARTITEM;
  onDelete?: (id: number) => void;
  onChange?: (e: CheckboxChangeEvent) => void;
}

const CartProduct = ({ item, onDelete, onChange }: IProps) => {
  const router = useRouter();
  const { checkoutItems, updateCheckoutItems } = useGlobalState();
  return (
    <div
      className="relative bg-white rounded-[5px] p-4 shadow-sm cursor-pointer"
      onClick={(e) => {
        if (
          (e.target as HTMLElement).nodeName !== "INPUT" &&
          (e.target as HTMLElement).nodeName !== "BUTTON"
        ) {
          router.push(`/listings/${item?.listing?.slug}`);
        }
      }}
    >
      <div className="px-3 py-2.5 border border-[#F4F4F4] rounded-[6px] p-3 mb-2">
        <div className="absolute left-0 -top-2">
          <Checkbox
            className="checkbox"
            name="cart-item"
            value={item?.id}
            checked={checkoutItems.includes(item?.id as any)}
            onChange={(e) => {
              e.stopPropagation();
              updateCheckoutItems?.(item?.id as any);
            }}
          />
        </div>
        <div className="relative h-[170px]">
          <img
            src={item?.listing?.images?.[0]?.url ?? ""}
            className="object-cover w-full h-full rounded"
            alt={item?.listing?.title}
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(item?.id as any);
          }}
          className="absolute -top-2 right-0 w-7 h-7 border border-primary hover:border-red-600 rounded-full grid place-items-center text-primary text-xs hover:text-red-600"
        >
          <IoMdClose />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-sofia-pro text-primary-100">
          {item?.listing?.user?.firstName}
        </h3>
        <RattingBar ratting={4.5} className="!text-[8px]" />
      </div>
      <p className="text-xs font-noraml font-sofia-pro text-opacity-50 text-primary-100">
        {item?.listing?.title}
      </p>
      <div className="flex items-center text-base text-primary font-sofia-pro font-medium">
        <Niger />
        <span className="ml-1">{item?.listing?.daily_price}/day</span>
      </div>
      <p className="text-xs font-noraml font-sofia-pro text-opacity-50 text-primary-100 mt-2">
        {item?.listing?.location_name}
      </p>
    </div>
  );
};

export default CartProduct;
