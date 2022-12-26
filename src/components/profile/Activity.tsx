import { Progress } from "antd";
import React from "react";

type ActivityProps = {
  title?: string;
  amount?: number;
  percent?: number;
  strokeColor?: string;
  trailColor?: string;
  strokeWidth?: number;
};

const Activity = ({
  title,
  amount,
  percent,
  strokeColor,
  trailColor,
  strokeWidth,
}: ActivityProps) => {
  return (
    <div className="relative activity cursor-pointer group p-5 border border-[#FDFCFC] rounded-md hover:bg-gradient-radial from-primary/90 to-primary overflow-hidden">
      <div className="group-hover:text-white font-sofia-pro">
        <div className="pt-9">
          <h2 className="text-inherit">{title}</h2>
          <h1 className="text-xl font-bold text-inherit">1,000</h1>
        </div>
        <div className="mt-4">
          <div className="w-full flex justify-between items-center font-bold">
            <p className="text-[#CCCCCC]">89%</p>
            <p className="text-secondary group-hover:text-white">+100</p>
          </div>
          <Progress
            percent={50}
            strokeColor={strokeColor}
            trailColor={trailColor}
            strokeWidth={8}
            showInfo={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Activity;
