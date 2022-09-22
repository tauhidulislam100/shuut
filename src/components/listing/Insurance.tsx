import React from 'react';
import { Checkbox, Radio, Space } from 'antd';
import Image from 'next/image';

const Insurance = ({setStep}:{setStep: React.Dispatch<React.SetStateAction<string>>}) => {

return (
    <div className="mt-20">
        <div className="flex justify-between items-center">
            <h2 className="font lota text-2xl">Our <span className="text-secondary font-semibold">Lender Guarantee</span>, underwritten by our partners covers you for up to #25,000 per item.</h2>
            <div className="">
                <Image 
                    src="/images/listing_logo.png"
                    alt="Logo"
                    width={80}
                    height={80}
                     />
            </div>
        </div>
        <Radio.Group className='w-full mt-10'>
            <Space direction='vertical' size={40} className='w-full'>
                <Radio value={"a"} className='w-full border px-7 py-4 rounded-[5px]'>
                    <div className="text-sm text-[#263238] pl-3">
                        <h2 className="font-sofia-pro">SHUUT Insurance Policy</h2>
                        {/* <p className="text-light mt-4">Bourdilon Court, Chevron, Lekki Ajah, Lagos, Nigeria</p> */}
                    </div>
                </Radio>
            </Space>
        </Radio.Group>
        <div className="mt-10 h-96 bg-[#FBFBFB] p-10">
            <h2 className="text-2xl font-lota">Insurance</h2>
        </div>
        <div className="flex pt-2">
            <Checkbox /> 
            <h3 className="pl-2 font-lota">Accept Insurance</h3>
        </div>
        <div className="mt-6 flex justify-end gap-5">
            <button onClick={() => setStep('location')} className='w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold'>
                Cancel
            </button>
            <button className='w-[193px] font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold'>
                List Item
            </button>
        </div>
    </div>
) 

};

export default Insurance;