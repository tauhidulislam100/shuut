import Link from "next/link";
import React from "react";
import { FiHeart } from "react-icons/fi";
import { formatMoney, turnicate } from "../../utils/utils";
import { Niger } from "../icons";
import RattingBar from "../ratting-bar/RattingBar";

type productProps = {
  id: number;
  title: string;
  slug: string;
  images: Record<string, string>[];
  daily_price: string;
  category: Record<string, string>;
  location_name: string;
  user: Record<string, any>;
};

type propsType = {
  data: productProps;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
};

const SingleProduct = ({
  data: { title, images, daily_price, location_name, user, slug },
  onMouseOver,
  onMouseLeave,
}: propsType) => {
  return (
    <Link href={`/listings/${slug}`}>
      <a>
        <div
          className="bg-white rounded-[4px] p-4 cursor-pointer border border-[#F4F4F4]"
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
        >
          <div className="h-[176px] border border-[#F4F4F4] rounded-[6px] p-3 mb-2 relative">
            <img
              src={images?.[0].url}
              className="object-cover w-full h-full rounded-[4px]"
            />
            <button className="absolute top-6 right-5 w-6 h-6 rounded-full grid place-items-center bg-[#E6EFFB] text-primary text-xs hover:text-red-600">
              <FiHeart />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-sofia-pro text-primary-100">
              {user?.firstName}
            </h3>
            <RattingBar ratting={3.5} className="!text-[8px]" />
          </div>
          <p className="text-xs font-noraml font-sofia-pro text-opacity-50 text-primary-100">
            {turnicate(title)}
          </p>
          <div className="flex items-center text-base text-primary font-sofia-pro font-medium">
            <Niger />
            <span className="ml-1">{formatMoney(daily_price)}/day</span>
          </div>
          <p className="text-xs font-noraml font-sofia-pro text-opacity-50 text-primary-100 mt-2">
            {location_name}
          </p>
        </div>
      </a>
    </Link>
  );
};

export default SingleProduct;
