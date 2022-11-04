import React, { useEffect, useState } from "react";
import Rental from "./Rental";
import Calendar from "./Calendar";
import MyItems from "./MyItems";
import { useRouter } from "next/router";

type TabType = "rentals" | "calendar" | "my-items";
const RentalShop = () => {
  const router = useRouter();
  const [tab, setTab] = useState<TabType>("rentals");

  const tabHandler = (text: TabType) => {
    setTab(text);
  };

  useEffect(() => {
    if (router && router.query?.tab) {
      setTab(router.query?.tab as TabType);
    }
  }, [router]);

  return (
    <div className="relative">
      <div className="w-full flex justify-center mt-[60px]">
        <div className="bg-[#EAEAEA4D] flex flex-wrap justify-center gap-5 font-lota text-2xl border text-[#6C6C6C] border-[#D9D8E34D] rounded-[5px] py-3.5 px-7">
          <button
            onClick={() => tabHandler("rentals")}
            className={`w-[201px] py-1  px-4 ${
              tab === "rentals" &&
              "shadow-md text-primary font-semibold rounded"
            }`}
          >
            Rentals
          </button>
          <button
            onClick={() => tabHandler("calendar")}
            className={`w-[201px] py-1  px-4 ${
              tab === "calendar" &&
              "shadow-md text-primary font-semibold rounded"
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => tabHandler("my-items")}
            className={`w-[201px] py-1  px-4 ${
              tab === "my-items" &&
              "shadow-md text-primary font-semibold rounded"
            }`}
          >
            My Items
          </button>
        </div>
      </div>
      {tab === "rentals" ? (
        <Rental />
      ) : tab === "calendar" ? (
        <Calendar />
      ) : (
        <MyItems />
      )}
    </div>
  );
};

export default RentalShop;
