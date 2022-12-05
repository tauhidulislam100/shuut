import React from "react";
import { FiHeart } from "react-icons/fi";
import { Niger } from "../icons";
import RattingBar from "../ratting-bar/RattingBar";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";

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
}

const CartProduct = ({ item, onDelete }: IProps) => {
  return (
    <div className="relative bg-white rounded-[5px] p-4 shadow-sm">
      <div className="px-3 py-2.5 border border-[#F4F4F4] rounded-[6px] p-3 mb-2">
        <div className="relative h-[176px]">
          <img
            src={item?.listing?.images?.[0]?.url ?? ""}
            className="object-cover w-full h-full rounded"
            alt={item?.listing?.title}
            // layout="fill"
          />
        </div>
        <button
          onClick={() => onDelete?.(item?.id as any)}
          className="absolute top-0 right-0 w-7 h-7 border border-primary hover:border-red-600 rounded-full grid place-items-center text-primary text-xs hover:text-red-600"
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
