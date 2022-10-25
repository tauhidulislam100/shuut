import { Avatar, Dropdown, Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
import { Modal } from "..";
import { RiMenu3Fill } from "react-icons/ri";

const NavLinkItem = ({
  label = "",
  href = "#",
  className = "",
  liClass = "",
}) => (
  <li className={liClass}>
    <Link href={href}>
      <a className={`text-body-50 font-outfit font-medium ${className}`}>
        {label}
      </a>
    </Link>
  </li>
);

interface IMenuProps {
  onLogout?: () => void;
}
const Menu = ({ onLogout }: IMenuProps) => (
  <ul className="shadow-md border rounded-[5px] text-primary text-[10px] font-lota bg-white">
    <li className="p-2 border-b hover:text-secondary">
      <Link href={"/inbox"}>
        <a>Inbox</a>
      </Link>
    </li>
    <li className="p-2 border-b hover:text-secondary">
      <Link href={"/profile?tab=rentals"}>
        <a>Rentals</a>
      </Link>
    </li>
    <li className="p-2 border-b hover:text-secondary">
      <Link href={"/favorites"}>
        <a>Favorites</a>
      </Link>
    </li>
    <li className="p-2 border-b hover:text-secondary">
      <Link href={"/profile"}>
        <a>Profile</a>
      </Link>
    </li>
    <li className="p-2 border-b hover:text-secondary">
      <Link href={"/profile?tab=myitems"}>
        <a>My Items</a>
      </Link>
    </li>
    <li className="p-2 text-[#EB001B]">
      <button onClick={onLogout}>Log Out</button>
    </li>
  </ul>
);

const AuthLessMenu = () => (
  <ul className="shadow-md border rounded-[5px] text-primary text-[10px] font-lota bg-white">
    <li className="p-2 border-b hover:text-secondary">
      <Link href={"/listgear"}>
        <a>List Gear</a>
      </Link>
    </li>
    <li className="p-2 border-b hover:text-secondary">
      <Link href={"/faqs"}>
        <a>Faqs</a>
      </Link>
    </li>
    <li className="p-2 border-b hover:text-secondary">
      <Link href={"/cart"}>
        <a>Cart</a>
      </Link>
    </li>
    <li className="p-2 border-b hover:text-secondary">
      <Link href={"/auth/login"}>
        <a>Login</a>
      </Link>
    </li>
    <li className="p-2 border-b hover:text-secondary">
      <Link href={"/auth/signup"}>
        <a>Sign Up</a>
      </Link>
    </li>
  </ul>
);

function NavBar() {
  const { isAuthenticated, user, onLogout } = useAuth();
  return (
    <div className="container">
      <nav className="w-full flex justify-between items-center py-5">
        <div className="text-primary text-2xl font-semibold">
          <Link href={"/"}>
            <a className="hover:text-primary">
              <img
                src="/images/logos/shuut-logo.png"
                className="object-cover max-w-full h-10"
                alt="shuut"
              />
            </a>
          </Link>
        </div>
        <ul className="flex items-center ml-auto gap-x-10">
          <div className="hidden lg:flex gap-x-10">
            <NavLinkItem label="How It Works" href="/how-it-works" />
            <NavLinkItem label="FAQs" />
            <NavLinkItem label="List Gear" href="/create-item" />
            <NavLinkItem label="Cart" href="/cart" />
          </div>
          {isAuthenticated ? (
            <div className="ml-32">
              <Dropdown
                overlay={<Menu onLogout={onLogout} />}
                trigger={["click"]}
              >
                <div className="flex items-center font-semibold font-lota cursor-pointer">
                  <div className="">
                    <Avatar size={40}>
                      <span className="uppercase font-bold text-primary">
                        {user?.firstName.charAt(0).toUpperCase()}
                      </span>
                    </Avatar>
                    {/* <Image
                    src={"/images/profile.png"}
                    alt="Jon Doe"
                    width={40}
                    height={40}
                  /> */}
                  </div>
                  <h1 className="px-5">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <MdOutlineKeyboardArrowDown className="text-xl" />
                </div>
              </Dropdown>
            </div>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-10">
                <NavLinkItem label="Login" href="/auth/login" liClass="ml-32" />
                <NavLinkItem
                  label="Sign Up"
                  href="/auth/signup"
                  className="bg-secondary h-[50px] w-[167px]  !text-white hover:text-white text-base font-medium inline-flex justify-center items-center rounded-lg"
                />
              </div>
              <Dropdown
                overlay={<AuthLessMenu />}
                trigger={["click"]}
                className="md:hidden"
              >
                <RiMenu3Fill className="text-2xl" />
              </Dropdown>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
