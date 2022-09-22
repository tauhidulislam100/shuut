import { Select } from 'antd';
import React from 'react';

const { Option } = Select;

const IdFrom = () => {

return (
    <div className="mt-5">
        <h1 className="text-[32px] font-lota font-semibold text-primary">What Country Is Your Government ID From?</h1>
        <p className="font-lota text-lg">SHUUT requires a photo of a government ID to verify your identity.</p>
        <div className="mt-12">
            <h4 className="mb-5">Choose options below:</h4>
            <Select className='w-full rounded-[5px]'>
                <Option value="1">Nigeria</Option>
                <Option value="2">USA</Option>
            </Select>
        </div>
        <div className="mt-6 flex justify-end gap-5">
            {/* <button onClick={() => console.log("Button!")} className='w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold'>
                Cancel
            </button> */}
            <button onClick={() => console.log("Button!")} className='w-[193px] font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold'>
                Next
            </button>
        </div>
        <div className="">
            <h1 className="text-primary text-[32px] font-lota font-semibold">Complete Identity Check</h1>
            <p className="text-lg font-lota mt-5">You will have the option to use the camera on your phone when needed.</p>
            <div className="border rounded-[5px] mt-10 bg-[#FCFCFD] font-lota">
                <p className="p-8">
                    You will have the option to use the camera on your phone when needed. 
                    By clicking the button below, you’re aggreing to the <span className="text-secondary"> privacy policy of</span> SHUUT, 
                    your biometric information, will be stored for more than 3 years.
                </p>
            </div>
            <div className="mt-12 flex justify-end gap-5">
                <button onClick={() => console.log("Button!")} className='w-[193px] font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold'>
                    Start Identity Check
                </button>
            </div>
        </div>
    </div>
) 

};

export default IdFrom;