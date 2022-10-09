import { Progress } from 'antd';
import React from 'react';

type ActivityProps = {
    title?: string,
    amount?: number,
    percent?: number,
    strokeColor?: string,
    strokeWidth?: number
}

const Activity = ({ title, amount, percent, strokeColor, strokeWidth }:ActivityProps) => {

return (
    <div className="relative cursor-pointer group p-5 hover:bg-gradient-radial from-primary/90 to-primary">
        <div className="group-hover:text-white font-sofia-pro bg-activity-strip bg-no-repeat bg-right-top">
            <div className="pt-9">
                <h2 className="text-inherit">Rentals</h2>
                <h1 className="text-xl font-bold text-inherit">1,000</h1>
            </div>
            <div className="mt-4">
                <div className="w-full flex justify-between items-center font-bold">
                    <p className="text-[#CCCCCC]">89%</p>
                    <p className="text-secondary group-hover:text-white">+100</p>
                </div>
                <Progress 
                    percent={50} 
                    strokeColor={'#FF8D01'} 
                    trailColor={'#FFE8CC'}
                    strokeWidth={8}
                    showInfo={false}
                        />
            </div>
        </div>
    </div>
) 

};

export default Activity;