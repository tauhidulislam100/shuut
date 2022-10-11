import { Dropdown, Input } from 'antd';
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

const Menu = ({ logoutHandler } : { logoutHandler: () => void }) => (
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
        <li onClick={logoutHandler} className="p-2 text-[#EB001B]">
            <a>Log Out</a>
        </li>
    </ul>
)

function NavBar() {

    const [logout, setLogout] = useState(false);
    const [remove, setRemove] = useState(false);

    return (
        <nav className='container'>
            <div className="w-full flex justify-between items-center py-5">
                <Modal onCancel={() => setLogout(false)} width={935} visible={logout}>
                    {!remove ? <>
                        <div className="flex justify-center items-center pt-16">
                            <Image src="/images/bulb.png" alt="Bulb Icon" width={30} height={30} />
                        </div>
                        <h1 className="mt-5 text-center font-semibold text-4xl font-lota text-primary">
                            Log Out
                        </h1>
                        <h4 className="text-center text-primary-100/30 text-2xl mt-3.5">Sign off SHUUT</h4>
                        <p className="mt-[18px] text-2xl text-[#010918F7] text-center">
                            Are you sure you want to Logout?
                        </p>
                        <div className="mt-5 flex justify-center">
                            <button onClick={() => console.log('trigger!')} className="min-w-[458px] btn py-3 text-xl bg-secondary text-white">
                            Yes, proceed
                            </button>
                        </div>
                        <p onClick={() => setRemove(true)} className="text-center text-[#898CA6] text-2xl font-lota font-semibold mt-4 pb-5">Delete My Account Permanently</p>
                    </>:
                    <>
                        <div className="flex justify-center items-center pt-16">
                            <Image src="/images/bulb.png" alt="Bulb Icon" width={30} height={30} />
                        </div>
                        <h1 className="mt-5 text-center font-semibold text-4xl font-lota text-primary">
                            Delete Account
                        </h1>
                        <h4 className="text-center text-primary-100/30 text-2xl mt-3.5">Remove this data from system</h4>
                        <p className="mt-[18px] text-2xl text-[#010918F7] text-center">
                            Deleting your account will remove all stats and data from our
                            system and your account details unavailable, you will require a new
                            registration in the future to use the SHUUT.
                        </p>
                        <div className="flex justify-center items-center my-3">
                            <Input.Password className='w-4/5' placeholder='Enter password' />
                        </div>
                        <div className="mt-5 flex justify-center">
                            <button onClick={() => setRemove(false)} className="min-w-[458px] btn py-3 text-xl bg-secondary text-white">
                                Delete
                            </button>
                        </div>
                    </>}
                </Modal>
                <div className="text-primary text-2xl font-semibold">
                    Shuut
                </div>
                <ul className='hidden lg:flex items-center ml-auto gap-x-10'>
                    <NavLinkItem label='How It Works' href='/how-it-works' />
                    <NavLinkItem label='FAQs' />
                    <NavLinkItem label='List Gear' href='/create-item' />
                    <NavLinkItem label='Cart' href='/cart' />
                    <>
                        <NavLinkItem label='Login' href='/login' liClass='ml-32' />
                        <NavLinkItem
                        label='Sign Up'
                        href='/signup'
                        className='bg-secondary h-[50px] w-[167px]  !text-white hover:text-white text-base font-medium inline-flex justify-center items-center rounded-lg' />
                    </>
                    {/* <div className="ml-32">
                        <Dropdown 
                            overlay={<Menu logoutHandler={() => setLogout(true)} />}
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
                    </div> */}
                </ul>
                <div className="lg:hidden">
                    <Dropdown 
                        overlay={<Menu logoutHandler={() => setLogout(true)} />}
                        trigger={['click']} >
                        <div className="flex items-center font-semibold font-lota cursor-pointer">
                            <div className="">
                                <Image
                                    src={'/images/profile.png'}
                                    alt="Jon Doe"
                                    width={40}
                                    height={40}
                                    objectFit="cover"
                                    />
                            </div>
                            <h1 className="px-5 hidden sm:block">
                                John Doe
                            </h1>
                            <MdOutlineKeyboardArrowDown className='text-xl'/>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;