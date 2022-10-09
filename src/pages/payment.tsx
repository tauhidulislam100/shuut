import Image from 'next/image';
import React from 'react';
import { Footer, NavBar } from '../components';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { Checkbox, Col, Form, Input, Rate, Row } from 'antd';

const Payment = () => {

return (
    <div className="">
        <div className="container">
            <NavBar />
        </div>
        <div className="border-b"></div>
        <main className="container mt-5 mb-5">
            <div className="">
                <button className='text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center'>
                    <span className='mr-2 text-secondary'><BsArrowLeftCircle /></span>
                    back
                </button>
            </div>
            <div className="mt-20">
                <h1 className="text-[32px] font-semibold text-primary font-lota">Transaction Summary</h1>
                <div className="mt-7 bg-[#FCFCFD] border bg-[] py-9 px-10 border-[#DFDFE6] rounded-[5px]">
                    <div className="flex justify-between items-center">
                        <h3 className="font-lota font-semibold text-xl text-primary">Order Summary</h3>
                        <h4 className="font-lota text-2xl text-primary">$51.00</h4>
                    </div>
                    {/* Items */}
                    <div className="border rounded-[5px] mt-10 bg-[#F8FAFC]">
                        {/* Item */}
                        <div className="p-5 border-b flex justify-between text-lg sm:text-xl md:text-2xl">
                            <div className="flex">
                                <div className="relative rounded-sm">
                                    <div className="">
                                        <Image 
                                            src={'/images/camera.png'}
                                            alt="Camera"
                                            width={124}
                                            height={124} 
                                            objectFit="cover" />
                                    </div>
                                    <div className="absolute top-0 flex justify-center items-center right-0 w-5 h-5 rounded-full p-2 text-xs text-primary shadow">1</div>
                                </div>
                                <div className="pl-7 font-lota">
                                    <h4 className="text-primary-100 pt-3">Canon</h4>
                                    <p className="text-[#677489] mt-3">Color: <span className="text-primary-100">Black</span></p>
                                </div>
                            </div>
                            <div className="">
                                <h4 className="font-lota text-2xl text-primary">$28.00</h4>
                            </div>
                        </div>
                        <div className="p-5 border-b flex justify-between">
                            <div className="flex">
                                <div className="relative rounded-sm">
                                    <div className="">
                                        <Image 
                                            src={'/images/camera.png'}
                                            alt="Camera"
                                            width={124}
                                            height={124} 
                                            objectFit="cover" />
                                    </div>
                                    <div className="absolute top-0 flex justify-center items-center right-0 w-5 h-5 rounded-full p-2 text-xs text-primary shadow">1</div>
                                </div>
                                <div className="pl-7 font-lota">
                                    <h4 className=" text-primary-100 pt-3">Canon</h4>
                                    <p className=" text-[#677489] mt-3">Color: <span className="text-primary-100">Black</span></p>
                                </div>
                            </div>
                            <div className="">
                                <h4 className="font-lota text-2xl text-primary">$28.00</h4>
                            </div>
                        </div>
                    </div>
                    <div className="sm:flex justify-between items-center py-7 border-b text-2xl font-lota">
                        <div className="">
                            <h4 className="">
                                <span className="text-[#677489]">Owner </span>
                                John Anwiri Doe
                            </h4>
                        </div>
                        <div className="">
                            <Rate defaultValue={4.5} disabled />
                            <span className="text-[#286EE6]">17 reviews</span>
                        </div>
                    </div>
                    <div className="text-[27px] font-lota py-7 border-b">
                        <div className="flex justify-between">
                            <h4 className="text-[#677489]">Total Rental Fee</h4>
                            <p className="">$56.00</p>
                        </div>
                        <div className="flex justify-between mt-3">
                            <h4 className="text-[#677489]">Vat</h4>
                            <p className="">-$13.00</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-7 text-[27px]">
                        <h4 className="">Total</h4>
                        <p className="text-[#4436AC] font-semibold">$51.00</p>
                    </div>
                </div>
            </div>
            <div className="font-lota">
                <h1 className="text-[32px] text-[#111729] mt-12">
                    Payment
                </h1>
                <div className="border mt-7 p-10 rounded-[5px] bg-[#FCFCFD]">
                    <h3 className="font-lota font-semibold text-xl mb-10">Payment Methods</h3>
                    <Form
                        wrapperCol={{span: 24}}
                        labelCol={{span: 24}} >
                        <Form.Item label="Card holder name">
                            <Input placeholder='John Doe' />
                        </Form.Item>
                        <Form.Item label="Billing address">
                            <Input placeholder='Nigeria' />
                        </Form.Item>
                        <Row gutter={200}>
                            <Col span={12}>
                                <Form.Item label="Zip code" >
                                    <Input placeholder='Ex. 73923' />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="City" >
                                    <Input placeholder='Ex. Victoria Islan' />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item className='flex'>
                            <Checkbox>
                                Billing address is same as shipping
                            </Checkbox>
                        </Form.Item>
                    </Form>
                    <div className="mt-6 flex justify-end gap-5">
                        <button className='w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold'>
                            Cancel
                        </button>
                        <button onClick={() => console.log("Clicked!")} className='w-[193px] font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold'>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
    </div>
) 

};

export default Payment;