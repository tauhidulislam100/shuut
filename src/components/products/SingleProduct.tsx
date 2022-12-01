import { useMutation } from "@apollo/client";
import { notification } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { UPDATE_FAVORITE } from "../../graphql/query_mutations";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
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
  state?: string;
  user: Record<string, any>;
};

type propsType = {
  data: productProps;
  action?: React.ReactNode;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
};

const SingleProduct = ({
  data,
  action,
  onMouseOver,
  onMouseLeave,
  onClick,
}: propsType) => {
  const { favorites, updateFavorites } = useGlobalState();
  const { user } = useAuth();
  const router = useRouter();
  const [addToFavorite, {}] = useMutation(UPDATE_FAVORITE, {
    onCompleted(data) {
      if (data?.favorite?.is_favorite) {
        notification.success({
          message: "added to favorites",
        });
      } else {
        notification.success({
          message: "removed from favorites",
        });
      }
      updateFavorites?.();
    },
    onError(error) {
      notification.error({
        message: error.message,
      });
    },
  });

  const isFavorite =
    favorites?.find(
      (item: Record<string, any>) =>
        item.listing.id === data?.id && item.is_favorite
    ) ?? false;

  const handleClick = () => {
    router.push(`/listings/${data.slug}`);
  };

  const onAddFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToFavorite({
      variables: {
        userId: user?.id,
        listingId: data?.id,
        isFavorite: !isFavorite,
      },
    });
  };

  return (
    <div
      className="bg-white rounded-[4px] p-4 cursor-pointer border border-[#F4F4F4]"
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick ?? handleClick}
    >
      <div className="h-[176px] border border-[#F4F4F4] rounded-[6px] p-3 mb-2 relative">
        <img
          src={data.images?.[0].url}
          className="object-cover w-full h-full rounded-[4px]"
          alt={data.title}
        />
        <button
          onClick={onAddFavorite}
          className={`absolute top-6 right-5 w-6 h-6 rounded-full grid place-items-center bg-[#E6EFFB] text-primary text-xs ${
            isFavorite ? "text-red-600" : "hover:text-red-600"
          }`}
        >
          {isFavorite ? <FaHeart /> : <FiHeart />}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-sofia-pro text-primary-100">
          {data.user?.firstName}
        </h3>
        <RattingBar ratting={3.5} className="!text-[8px]" />
      </div>
      <p className="text-xs font-noraml font-sofia-pro text-opacity-50 text-primary-100">
        {turnicate(data.title)}
      </p>
      <div className="flex items-center text-base text-primary font-sofia-pro font-medium justify-between">
        <div className="flex items-center">
          <Niger />
          <span className="ml-1">{formatMoney(data.daily_price)}/day</span>
        </div>
        {action}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-noraml font-sofia-pro text-opacity-50 text-primary-100 mt-2">
          {turnicate(data.location_name, 28)}
        </p>
        {data.state ? (
          <p
            className={`text-xs font-medium font-sofia-pro mt-2 capitalize ${
              data.state.toLocaleLowerCase() === "rented"
                ? "text-[#06E775]"
                : data.state.toLocaleLowerCase() === "not available"
                ? "text-[#EB001B]"
                : "text-orange-500"
            }`}
          >
            {data.state}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default SingleProduct;
