import React from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Form, Radio, Space } from 'antd';

const UploadId = ({handleNext}: {handleNext: () => void}) => {

return (
    <div className="mt-5">
        <h1 className="text-[32px] font-lota font-semibold text-primary">Upload ID</h1>
        <p className="font-lota text-lg">SHUUT requires a photo of a government ID to verify your identity</p>
        <Form className='mt-12'>
            <h5 className="">Choose options below:</h5>
            <Radio.Group className='w-full'>
                <Space direction='vertical'>
                    <Radio name="id_type" value={'id'} className='w-full border rounded-[5px] p-5 mt-5'>
                        <div className="w-full flex justify-between items-center">
                            <h3 className="font-sofia-pro text-sm text-[#263238]">National Identification</h3>
                            <div className="">
                                <MdKeyboardArrowRight className='text-xl text-[#323232]' />
                            </div>
                        </div>
                    </Radio>
                    <Radio name="id_type" value={'license'} className='w-full border rounded-[5px] p-5 mt-5'>
                        <div className="w-full flex justify-between items-center">
                            <h3 className="font-sofia-pro text-sm text-[#263238]">Driver’s Licence</h3>
                            <div className="">
                                <MdKeyboardArrowRight className='text-xl text-[#323232]' />
                            </div>
                        </div>
                    </Radio>
                    <Radio name="id_type" value={'passport'} className='w-full border rounded-[5px] p-5 mt-5'>
                        <div className="w-full flex justify-between items-center">
                            <h3 className="font-sofia-pro text-sm text-[#263238]">Passport</h3>
                            <div className="">
                                <MdKeyboardArrowRight className='text-xl text-[#323232]' />
                            </div>
                        </div>
                    </Radio>
                    <Radio name="id_type" value={'residence'} className='w-full border rounded-[5px] p-5 mt-5'>
                        <div className="w-full flex justify-between items-center">
                            <h3 className="font-sofia-pro text-sm text-[#263238]">Residence Permit</h3>
                            <div className="">
                                <MdKeyboardArrowRight className='text-xl text-[#323232]' />
                            </div>
                        </div>
                    </Radio>
                </Space>
            </Radio.Group>
            <div className="mt-6 flex justify-end gap-5">
                <button onClick={() => console.log("Button!")} className='w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold'>
                    Cancel
                </button>
                <button onClick={handleNext} className='w-[193px] hover:bg-primary font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold'>
                    Next
                </button>
            </div>
        </Form>
    </div>
) 

};

export default UploadId;