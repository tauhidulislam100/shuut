import { Dropdown } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { Modal } from '..';


const NavLinkItem = ({ label = '', href = "#", className = '', liClass = '' }) => (
    <li className={liClass}>
        <Link href={href}>
            <a className={`text-body-50 font-outfit font-medium ${className}`}>
                {label}
            </a>
        </Link>
    </li>
);

const Menu = () => (
    <ul className="shadow-md border rounded-[5px] text-primary text-[10px] font-lota bg-white">
        <li className="p-2 border-b hover:text-secondary">
            <Link href={'/inbox'}><a>Inbox</a></Link>
        </li>
        <li className="p-2 border-b hover:text-secondary">
            <Link href={'/profile?tab=rentals'}><a>Rentals</a></Link>
        </li>
        <li className="p-2 border-b hover:text-secondary">
            <Link href={'/favorites'}><a>Favorites</a></Link>
        </li>
        <li className="p-2 border-b hover:text-secondary">
            <Link href={'/profile'}><a>Profile</a></Link>
        </li>
        <li className="p-2 border-b hover:text-secondary">
            <Link href={'/profile?tab=myitems'}><a>My Items</a></Link>
        </li>
        <li className="p-2 text-[#EB001B]">
            <a>Log Out</a>
        </li>
    </ul>
)

function NavBar() {

    const [logout, setLogout] = useState();

    return (
        <nav className='w-full flex justify-between items-center py-5'>
            <Modal >
                <div className="flex justify-center items-center">
                    <Image src="/images/bulb.png" alt="Bulb Icon" width={30} height={30} />
                </div>
                <h1 className="mt-5 text-center font-semibold text-4xl text-primary">Enter Your Phone Number</h1>
                <p className="mt-[18px] text-2xl text-[#010918F7] text-center">
                    In order to secure your new SHUUT account we will<br/> 
                    need to verify your phone number.
                </p>
                <div className="w-full flex justify-center mt-5">
                    
                </div>
                <div className="mt-5 flex justify-center">
                    <button onClick={() => console.log('trigger!')} className="min-w-[275px] btn px-6 py-5 text-xl bg-secondary text-white">Send Verification Code</button>
                </div>
            </Modal>
            <div className="text-primary text-2xl font-semibold">
                Shuut
            </div>
            <ul className='flex items-center ml-auto gap-x-10'>
                <NavLinkItem label='How It Works' href='/how-it-works' />
                <NavLinkItem label='FAQs' />
                <NavLinkItem label='List Gear' href='/create-item' />
                <NavLinkItem label='Cart' href='/cart' />
                {/* <>
                    <NavLinkItem label='Login' href='/login' liClass='ml-32' />
                    <NavLinkItem
                    label='Sign Up'
                    href='/signup'
                    className='bg-secondary h-[50px] w-[167px]  !text-white hover:text-white text-base font-medium inline-flex justify-center items-center rounded-lg' />
                </> */}
                <div className="ml-32">
                    <Dropdown 
                        overlay={<Menu />}
                        trigger={['click']} >
                        <div className="flex items-center font-semibold font-lota cursor-pointer">
                            <div className="">
                                <Image
                                    src={'/images/profile.png'}
                                    alt="Jon Doe"
                                    width={40}
                                    height={40}
                                    />
                            </div>
                            <h1 className="px-5">
                                John Doe
                            </h1>
                            <MdOutlineKeyboardArrowDown className='text-xl'/>
                        </div>
                    </Dropdown>
                </div>
            </ul>
        </nav>
    )
}

export default NavBar;