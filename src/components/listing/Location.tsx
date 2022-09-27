import React, { useState } from 'react';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { BiCurrentLocation } from 'react-icons/bi';
import { Checkbox, Radio, Space } from 'antd';

const Location = ({setStep}:{setStep: React.Dispatch<React.SetStateAction<string>>}) => {

    const findLocation = () => {
        window.navigator.geolocation.getCurrentPosition(pos => console.log(pos));
    };

return (
    <div className="">
        <h3 className="">Enter Location</h3>
        <div onClick={findLocation} className="mt-5 cursor-pointer flex justify-start items-center w-full border px-7 py-4 rounded-[5px]">
            <div className="">
                <BiCurrentLocation className='text-xl text-primary' />
            </div>
            <div className="pl-2.5">
                <h2 className="">Select My Location</h2>
                <p className="">Auto Complete</p>
            </div>
        </div>
        <Radio.Group className='w-full mt-10'>
            <Space direction='vertical' size={40} className='w-full'>
                <Radio value={"a"} className='w-full border px-7 py-4 rounded-[5px]'>
                    <div className="text-sm text-[#263238] pl-3">
                        <h2 className="font-sofia-pro">SHUUT Delivery <span className="font-light pl-2.5">+234010000783</span></h2>
                        <p className="text-light mt-4">Bourdilon Court, Chevron, Lekki Ajah, Lagos, Nigeria</p>
                    </div>
                </Radio>
                <Radio value="b" className='w-full border px-7 py-4 rounded-[5px]'>
                    <div className="text-sm text-[#263238] pl-3">
                        <h2 className="font-sofia-pro">SELF Delivery <span className="font-light pl-2.5">+234010000783</span></h2>
                        <p className="text-light mt-4">Bourdilon Court, Chevron, Lekki Ajah, Lagos, Nigeria</p>
                    </div>
                </Radio>
            </Space>
        </Radio.Group>
        <h1 className="mt-12 text-2xl font-lota font-semibold text-primary">Read Our Logistics Terms & Condiotions</h1>
        <div className="mt-10 h-96 bg-[#FBFBFB] p-10">
            <h2 className="text-2xl font-lota">Terms &amp; Conditions</h2>
        </div>
        <div className="flex pt-2">
            <Checkbox className='checkbox-label'>
                Accept Terms &amp; Conditions
            </Checkbox>
        </div>
        <div className="mt-6 flex justify-end gap-5">
            <button onClick={() => setStep('info')} className='w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold'>
                Cancel
            </button>
            <button onClick={() => setStep('insurance')} className='w-[193px] font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold'>
                Next
            </button>
        </div>
    </div>
) 

};

export default Location;