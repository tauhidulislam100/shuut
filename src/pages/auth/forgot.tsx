import React, { useState } from 'react';
import { Footer, Modal, NavBar } from '../../components';
import { IoIosSearch } from 'react-icons/io';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';
import { Checkbox, Form, Input } from 'antd';
import Image from 'next/image';
import OtpInput from 'react-otp-input';

import Link from 'next/link';

const Forgot = () => {

    const [token, setToken] = useState(false);
    const [showModal, setModal] = useState(false);
    const [otp, setOtp] = useState<string | undefined>();

    const verifyHandler = () => {
        setToken(true);
        setModal(false);
    };

return (
    <div className="bg-white">
        <Modal width={935} visible={showModal}>
            <div className="flex justify-center items-center pt-10">
                <Image src="/images/bulb.png" alt="Bulb Icon" width={30} height={30} />
            </div>
            <h1 className="mt-5 text-center font-semibold text-4xl text-primary">Validate Token</h1>
            <p className="mt-[18px] text-2xl text-[#010918F7] text-center">
                An OTP was sent to your phone number {5465545},<br/>
                please check and enter below.
            </p>
            <div className="w-full flex justify-center mt-5">
                <OtpInput
                    value={otp}
                    onChange={(o:string) => setOtp(o)}
                    placeholder="****"
                    numInputs={4}
                    containerStyle="react-otp-input"
                    inputStyle={{
                        width: "3rem",
                        height: "3rem",
                        paddingTop: "5px",
                        margin: "0 0.6rem",
                        fontSize: "2rem",
                        borderRadius: 4,
                        border: "1px solid rgba(0,0,0,0.3)"
                    }}
                    />
            </div>
            <div className="mt-5 flex justify-center">
                <button
                onClick={verifyHandler} 
                    className="min-w-[275px] btn px-6 py-5 text-xl bg-secondary text-white">
                        Verify
                </button>
            </div>
            <p className="pb-10 text-center text-[#898CA6] text-2xl font-semibold font-lota pt-4">
                Didn&apos;t get OTP? <span className="text-secondary">Resend</span>
            </p>
        </Modal>
        <div className="container">
            <NavBar />
        </div>
        <div className="container">
            <div className="flex items-center w-[430px] max-w-full border border-body-light rounded-lg p-[2px] relative">
                <input placeholder='Search...' className='min-w-max px-10 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light bg-transparent' />
                <button className='px-7 h-12 bg-secondary text-white min-w-max rounded-r-lg'>
                    Find Gear
                </button>
                <span className='absolute top-4 left-4 text-lg text-[#263238]'>
                    <IoIosSearch />
                </span>
            </div>
            <div className="mt-28">
                <h1 className="mb-12 font-lota text-center font-semibold text-[26px] text-[#525252]">Forgot Password</h1>
                {
                    !token ?
                    <Form
                    size='large'
                    className='login-form w-[65%] mx-auto'>
                        <Form.Item name="email">
                            <Input placeholder='Email' className='' />
                        </Form.Item>
                        <div className="flex justify-center mt-10">
                            <button onClick={() => setModal(true)} className="btn w-[275px] px-6 py-5 text-xl bg-secondary text-white"> Confirm </button>
                        </div>
                    </Form>:
                    <Form
                    size='large'
                    className='login-form w-[65%] mx-auto'>
                        <Form.Item name="password">
                            <Input.Password placeholder='New Password' className='' />
                        </Form.Item>
                        <Form.Item name="email">
                            <Input.Password placeholder='Confirm Password' className='' />
                        </Form.Item>
                        <div className="flex justify-center mt-10">
                            <button onClick={() => setToken(false)} className="btn w-[275px] px-6 py-5 text-xl bg-secondary text-white"> Confirm </button>
                        </div>
                    </Form>
                }
            </div>
        </div>
        <Footer />
    </div>
) 

};

export default Forgot;