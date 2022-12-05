import { DatePicker, Progress } from 'antd';
import React from 'react';
import { IoMdCrop } from 'react-icons/io';
import Activity from './Activity';

const Activities = () => {

    const { RangePicker } = DatePicker;
return (
    <div className="mt-[60px]">
        <div className="flex justify-between items-center gap-10">
            <h1 className="font-lota text-2xl font-semibold text-primary">Activities</h1>
            <RangePicker suffixIcon={undefined} separator={'-'} />
        </div>
        <div className="mt-[60px] grid md:grid-cols-3 gap-5">
            {
                Array(9).fill('').map((_,idx) => <Activity key={idx} />)
            }
        </div>
    </div>
) 

};

export default Activities;