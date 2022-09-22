import { Dropdown } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';


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
    <div className="shadow">
        Menu
    </div>
)

function NavBar() {
    return (
        <nav className='w-full flex items-center py-5'>
            <ul className='flex items-center ml-auto gap-x-10'>
                <NavLinkItem label='How It Works' href='/how-it-works' />
                <NavLinkItem label='FAQs' />
                <NavLinkItem label='List Gear' />
                <NavLinkItem label='Cart' href='/cart' />
                {/* <>
                    <NavLinkItem label='Login' href='/login' liClass='ml-32' />
                    <NavLinkItem
                    label='Sign Up'
                    href='/signup'
                    className='bg-secondary h-[50px] w-[167px]  !text-white hover:text-white text-base font-medium inline-flex justify-center items-center rounded-lg' />
                </> */}
                <Dropdown overlay={<Menu />} >
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
            </ul>
        </nav>
    )
}

export default NavBar;