import Link from 'next/link';
import React from 'react'


const NavLinkItem = ({ label = '', href = "#", className = '', liClass = '' }) => (
    <li className={liClass}>
        <Link href={href}>
            <a className={`text-body-50 font-outfit font-medium ${className}`}>
                {label}
            </a>
        </Link>
    </li>
);

function NavBar() {
    return (
        <nav className='w-full flex items-center py-5'>
            <ul className='flex items-center ml-auto gap-x-10'>
                <NavLinkItem label='How It Works' href='how-it-works' />
                <NavLinkItem label='FAQs' />
                <NavLinkItem label='List Gear' />
                <NavLinkItem label='Cart' />
                <NavLinkItem label='Login' liClass='ml-32' />
                <NavLinkItem
                    label='Sign Up'
                    className='bg-secondary h-[50px] w-[167px]  !text-white hover:text-white text-base font-medium inline-flex justify-center items-center rounded-lg' />
            </ul>
        </nav>
    )
}

export default NavBar;