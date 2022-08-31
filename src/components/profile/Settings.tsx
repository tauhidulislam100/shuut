import { Switch } from 'antd';
import React from 'react';

const Settings = () => {

return (
    <div className="mt-[60px]">
        <h1 className="font-lota text-2xl font-semibold text-primary">Settings</h1>
        <div className="">
            {
                Array(3).fill('').map((_,idx) => (
                    <div key={idx} className="mt-[60px] flex justify-between items-center pb-6 border-b">
                        <div className="font-lota">
                            <h2 className="text-inherit text-xl font-semibold">Show Ratings</h2>
                            <p className="text-[#77838F] text-xl">See all ratings and reviews sent by users</p>
                        </div>
                        <div className="">
                            <Switch className='bg-[#32A071]' defaultChecked />
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
) 

};

export default Settings;