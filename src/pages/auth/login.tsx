import React from 'react';
import { Footer, NavBar } from '../../components';
import { IoIosSearch } from 'react-icons/io';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';
import { Checkbox, Form, Input } from 'antd';
import Link from 'next/link';

const Login = () => {

return (
    <div className="bg-white">
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
                <h1 className="font-lota text-center font-semibold text-[26px] text-[#525252]">Welcome to SHUUT</h1>
                <div className="flex justify-center items-center gap-5 mt-12">
                    <button className='min-w-[193px] px-4 flex justify-center font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#A1A1A1] h-12 items-center text-lg'>
                        <FcGoogle className='mr-2 text-3xl' /> Continue with Google
                    </button>
                    <button className='min-w-[193px] px-4 flex justify-center font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#A1A1A1] h-12 items-center text-lg'>
                        <FaApple className='mr-2 text-black text-3xl' /> Continue with Facebook
                    </button>
                    <button className='min-w-[193px] px-4 flex justify-center font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#A1A1A1] h-12 items-center text-lg'>
                        <FaFacebook className='mr-2 text-[#3b5998] text-3xl' /> Continue with Facebook
                    </button>
                </div>
                <div className="px-2 text-center mt-10 mb-20 uppercase text-[#525252]">-or-</div>
                <Form
                    size='large'
                    className='login-form w-[65%] mx-auto'>
                    <Form.Item name="email">
                        <Input placeholder='Email' className='' />
                    </Form.Item>
                    <Form.Item name="password">
                        <Input.Password placeholder='Password' className='' />
                    </Form.Item>
                    <p className="font-sofia-pro text-[#263238] text-right mb-10">Forgot Password? Click <span className="text-secondary font-semibold">Here</span> to Reset</p>
                    <Form.Item name="remember" className='font-sofia-pro' valuePropName="checked">
                        <Checkbox>Send me updates about cool new gear, Production jobs, and inspiration from <span className="text-secondary">SHUUT</span> community.</Checkbox>
                    </Form.Item>
                    <div className="flex justify-center mt-10">
                        <button className="btn w-[275px] px-6 py-5 text-xl bg-secondary text-white"> Log In </button>
                    </div>
                    <p className="my-10">
                        Don&apos;t have an account? <Link href={'/signup'}><a className="text-secondary">Sign Up</a></Link>
                    </p>
                </Form>
            </div>
        </div>
        <Footer />
    </div>
) 

};

export default Login;