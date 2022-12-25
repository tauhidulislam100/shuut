import React from "react";
import CalendarIcon from "../icons/CalendarIcon";
import Activity from "./Activity";

const activities = [
  { label: "Rentals", strokeColor: "#FF8D01", trailColor: "#FFE8CC" },
  { label: "Total Request", strokeColor: "#4436AC", trailColor: "#4436AC17" },
  {
    label: "Completed Transactions",
    color: "#5D5FEF",
    strokeColor: "#5D5FEF",
    trailColor: "#D7D7EF",
  },
  { label: "Pending Request", strokeColor: "#F0526E", trailColor: "#F0D8DC" },
  { label: "Total Messages", strokeColor: "#FF8D01", trailColor: "#FFE8CC" },
  { label: "Responses Speed", strokeColor: "#4436AC", trailColor: "#4436AC17" },
  { label: "Favourite", strokeColor: "#5D5FEF", trailColor: "#D7D7EF" },
  { label: "Deleted Items", strokeColor: "#F0526E", trailColor: "#F0D8DC" },
  { label: "Total Earnings", strokeColor: "#52BD95", trailColor: "#FFE8CC" },
];

const Activities = () => {
  return (
    <div className="mt-[60px]">
      <div className="flex justify-end">
        <button
          onClick={undefined}
          className="flex items-center border border-secondary rounded-md h-[45px] justify-between px-4 text-secondary capitalize text-sm font-normal font-lota"
        >
          <div className="inline-flex items-center">
            <span className="mr-1">
              <CalendarIcon />
            </span>
            {false ? "" : "Start Date"}
          </div>
          <span className="mx-3">-</span>
          <div className="inline-flex items-center">
            <span className="mr-1">
              <CalendarIcon />
            </span>
            {false ? "" : "End Date"}
          </div>
        </button>
      </div>
      <div className="mt-[60px] grid md:grid-cols-3 gap-8 overflow-hidden">
        {activities.map((activity, idx) => (
          <Activity
            title={activity.label}
            strokeColor={activity.strokeColor}
            trailColor={activity.trailColor}
            key={idx}
          />
        ))}
      </div>
    </div>
  );
};

export default Activities;
