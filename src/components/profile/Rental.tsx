import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { RiEqualizerLine } from "react-icons/ri";
import { AiOutlineCloudDownload } from "react-icons/ai";
import SingleProduct from "../products/SingleProduct";
import { tripodInLagos } from "../../data";
import { Checkbox, Dropdown } from "antd";
import ActiveRental from "./ActiveRental";

const Menu = () => (
  <ul className="shadow-md border rounded-[5px] text-primary text-[10px] font-lota bg-white w-[187px]">
    <li className="p-2 border-b hover:text-secondary">
      <Checkbox>
        <span className="">Date</span>
      </Checkbox>
    </li>
    <li className="p-2 border-b hover:text-secondary">
      <Checkbox>
        <span className="">Rented</span>
      </Checkbox>
    </li>
    <li className="p-2 border-b hover:text-secondary">
      <Checkbox>
        <span className="">In Process</span>
      </Checkbox>
    </li>
  </ul>
);

const Rental = () => {
  const [filter, setFilter] = useState("rental");

  return (
    <>
      <div className="mt-[60px] w-full md:flex justify-between">
        <div className="">
          <div className="flex items-center md:w-[430px] max-w-full border border-body-light rounded-lg p-[2px] relative">
            <input
              placeholder="Search..."
              className="min-w-max px-10 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light bg-transparent"
            />
            <button className="px-7 h-12 bg-secondary text-white min-w-max rounded-r-lg">
              Find Gear
            </button>
            <span className="absolute top-4 left-4 text-lg text-[#263238]">
              <IoIosSearch />
            </span>
          </div>
        </div>
        <div className="mt-5 md:mt-0 flex items-center gap-5">
          <button
            onClick={() => setFilter("new")}
            className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota ${
              filter === "new"
                ? "border-secondary text-secondary"
                : "border-[#D0CFD84D]"
            }`}
          >
            New Request
          </button>
          <button
            onClick={() => setFilter("today")}
            className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota ${
              filter === "today"
                ? "border-secondary text-secondary"
                : "border-[#D0CFD84D]"
            }`}
          >
            Handover Today
          </button>
          <button
            onClick={() => setFilter("tomorrow")}
            className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota ${
              filter === "tomorrow"
                ? "border-secondary text-secondary"
                : "border-[#D0CFD84D]"
            }`}
          >
            Handover Tomorrow
          </button>
          <button
            onClick={() => setFilter("list")}
            className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota ${
              filter === "list"
                ? "border-secondary text-secondary"
                : "border-[#D0CFD84D]"
            }`}
          >
            List View
          </button>
          <div className="text-3xl text-[#3E4958] hover:text-secondary cursor-pointer">
            <Dropdown overlay={<Menu />} trigger={["click"]}>
              <RiEqualizerLine />
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="w-full mt-[60px] flex justify-end">
        <button className="bg-secondary text-white font-lota rounded-md px-8 py-2.5 flex items-center">
          <AiOutlineCloudDownload className="mr-2 text-lg" />
          Download
        </button>
      </div>
      {filter !== "rental" ? (
        <div className="">
          <h1 className="text-2xl text-primary">
            {filter === "new"
              ? "New Request"
              : filter === "today"
              ? "Today"
              : filter === "tomorrow"
              ? "Tomorrow"
              : "List View"}
          </h1>
          <div className="space-y-5 sm:space-y-0 sm:grid grid-cols-3 md:grid-cols-4">
            {tripodInLagos.map((product, idx) => (
              <SingleProduct key={`today_${idx}`} data={product as any} />
            ))}
          </div>
        </div>
      ) : (
        <ActiveRental />
      )}
    </>
  );
};

export default Rental;
