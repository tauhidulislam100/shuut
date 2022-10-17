import React from 'react';
import { NavBar } from '../components';
import { BsArrowLeftCircle } from 'react-icons/bs';
import Image from 'next/image';
import { IoIosClose } from 'react-icons/io';
import { Tabs } from 'antd';
import { Niger } from '../components/icons';

const { TabPane } = Tabs;

const Listed = () => {

    return (
        <div className="">
            <NavBar />
            <div className="border-b"></div>
            <main className="container mx-auto">
                <div className="my-5">
                    <button className='text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center'>
                        <span className='mr-2 text-secondary'><BsArrowLeftCircle /></span>
                        back
                    </button>
                </div>
                <div className="mt-20 container mx-auto">
                    <h1 className="font-lota text-[32px] font-semibold text-primary">Listed</h1>
                    <div className="">
                        <h3 className="mt-10 mb-8 font-lota text-lg text-primary-200">Photo</h3>
                        <div className="w-full flex justify-center">
                            <div className="relative px-2 py-1.5  border rounded-md">
                                <Image
                                    src={'/images/listed.png'}
                                    alt="Listed Image"
                                    width={422}
                                    height={256}
                                    className="object-cover" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <div className="bg-white rounded-md border p-4 mb-4 relative h-[285px]">
                            <button className='absolute top-3 right-3 rounded-full w-6 h-6 inline-grid place-items-center border border-[#F4F4F4]'>
                                <IoIosClose />
                            </button>
                            <Tabs className='profile-tabs mt-4'>
                                <TabPane key="1" tab="Monthly Price">
                                    {/* <div className="mt-6 flex justify-center">
                                        <button className='font-sofia-pro px-7 bg-secondary rounded-md text-white h-8 inline-flex items-center text-sm font-medium'>
                                            Check Availabilty
                                        </button>
                                    </div> */}
                                </TabPane>
                                <TabPane key="2" tab="Weekly Price">
                                    <div className="flex items-center">
                                        <p className='inline-flex items-center text-lg font-sofia-pro text-secondary'><span><Niger /></span> 300,000/days </p>
                                        <p className='text-lg font-sofia-pro text-secondary mx-2'>-</p>
                                        <p className='inline-flex items-center text-lg font-sofia-pro text-secondary'><span><Niger /></span> 300,000</p>
                                    </div>
                                    <p className='text-sm my-5 text-primary-100 text-opacity-90'>We’ve analysed prices for Video CameraREWK17 from all renters on SHUUT.</p>
                                    <p className='text-sm text-primary-100 text-opacity-90'>The advert price is above average.</p>
                                </TabPane>
                                <TabPane key="3" tab="Daily Price">
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                    <div className="">
                        <h3 className="mt-10 mb-8 font-lota text-lg text-primary-200">Category</h3>
                        <div className="w-full flex justify-center">
                            <div className="relative px-2 py-1.5  border rounded-md">
                                <Image
                                    src={'/images/rectangle.png'}
                                    alt="Listed Image"
                                    width={422}
                                    height={256}
                                    className="object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
};

export default Listed;