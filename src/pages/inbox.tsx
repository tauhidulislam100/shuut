import React, { useState } from 'react';
import Image from 'next/image';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { RiDeleteBinFill } from 'react-icons/ri';
import { Footer, NavBar } from '../components';
import { Input } from 'antd';

const Message = () => {

    const [message, setMessage] = useState(false);

    const noItem = (
        <>
            <div className="mt-20">
                <h1 className="text-primary text-[32px] font-semibold">Message</h1>
            </div>
            <div className="py-10 flex justify-center items-center">
                <Image 
                    src={'/images/no_message.png'}
                    alt="Profile Image"
                    width={571}
                    height={365}
                    />
            </div>
            <div className="flex justify-center mt-[60px]">
                <button onClick={() => setMessage(!message)} className=" bg-secondary hover:bg-primary  h-[48px] w-[193px] text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                    Go Home
                </button>
            </div>
        </>
    );

return (
    <div className="bg-[#F8FAFC]">
        <div className="container">
            <NavBar />
        </div>
        <div className="border-b"></div>
        <main className="container mt-5 pb-10">
            <div className="">
                <button className='text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center'>
                    <span className='mr-2 text-secondary'><BsArrowLeftCircle /></span>
                    back
                </button>
            </div>
            { message ? 
            <div className="mt-20 border-b bg-[#FDFCFC] rounded">
                <div className="flex items-end border-b p-2">
                    <div className="w-2/5">
                        <button className="btn border w-40 text-center py-2 cursor-pointer">
                            New Message
                        </button>
                    </div>
                    <div className="flex-1 flex items-end justify-between">
                        <h3 className="font-lota text-lg text-[#0C0D0C]">Nelson mandela</h3>
                        <div className="flex items-center gap-1">
                            <Input type='checkbox' className='cursor-pointer' />
                            <RiDeleteBinFill className='w-full text-xl cursor-pointer hover:text-red-500' />
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div className="w-2/5 min-h-screen p-5">
                        <div className="flex">
                            <div className="">
                                <Image 
                                    src="/images/profile.png" 
                                    alt="Profile Pic"
                                    width={50}
                                    height={50} />
                            </div>
                            <div className="flex-1 pl-4">
                                <div className="flex justify-between">
                                    <h1 className="font-bold font-sofia-pro">Nelson Mandela</h1>
                                    <p className="text-xs font-sofia-pro text-[#0A242980]">January, 2022</p>
                                </div>
                                <p className="text-sm font-sofia-pro">Yes, I have the Canon MXTY...</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 border-l pt-5">
                        
                        {/* Message body */}
                        <div className="px-5">
                            <h4 className="mb-5 text-xs font-sofia-pro text-[#0A242980] text-center">January, 2022</h4>
                            {/* Left Item */}
                            <div className="w-full">
                                <div className="w-4/5 flex">
                                    <div className="w-20 pt-3">
                                        <Image 
                                            src={'/images/profile.png'}
                                            alt="Profile Pic"
                                            width={50}
                                            height={50}
                                            objectFit="cover" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="border rounded-md bg-white">
                                            <p className="px-6 py-4 text-primary">
                                                Hello, I am looking for Toyota Camry 2020, Four doors, a big trunk and enough space for the family — it&apos;s eveyrybnand jaajsow nmnjllll.
                                            </p>
                                        </div>
                                        <div className="mt-4 space-x-2 flex items-center gap-3 font-medium text-sm font-sofia-pro">
                                            <span className="text-[#C4C4C4]">Read</span>
                                            <span className="inline-block w-3 h-3 rounded-full bg-slate-400"></span>
                                            <span className="text-[#FF0200]">Flag</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Right Item */}
                            <div className="w-full flex justify-end mt-6">
                                <div className="w-4/5 flex flex-row-reverse">
                                    <div className="w-20 pt-3">
                                        <Image 
                                            src={'/images/profile.png'}
                                            alt="Profile Pic"
                                            width={50}
                                            height={50}
                                            objectFit="cover" />
                                    </div>
                                    <div className="mr-4">
                                        <div className="border rounded-md bg-primary">
                                            <p className="px-6 py-4 text-white">
                                                Hello, I am looking for Toyota Camry 2020, Four doors, a big trunk and enough space for the family — it&apos;s eveyrybnand jaajsow nmnjllll.
                                            </p>
                                        </div>
                                        <div className="w-full mt-4 space-x-2 flex justify-end items-center gap-3 font-medium text-sm font-sofia-pro">
                                            <span className="text-[#C4C4C4]">Read</span>
                                            <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                                            <span className="text-[#FF0200]">Flag</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t bg-white flex justify-end pb-5 pr-5">
                            <div className="w-4/5 flex items-end gap-5 mt-9">
                                <input type="text" placeholder='Write a message...' className="w-full align-top border px-5 font-sofia-pro border-secondary rounded-md h-20" />
                                <button className="font-sofia-pro font-medium px-6 rounded-md text-white py-2 bg-secondary text-[10px]">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>: noItem}
        </main>
    </div>
) 

};

export default Message;