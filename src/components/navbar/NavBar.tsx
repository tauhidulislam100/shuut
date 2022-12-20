import { Avatar, Dropdown, Input, notification } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
import { Modal } from "..";
import { RiMenu3Fill } from "react-icons/ri";
import Button from "../UI/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { DELETE_ACCOUNT } from "../../graphql/query_mutations";

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
  <>
    <div id="triangle-up" className="absolute  top-2 right-0"></div>
    <ul className="shadow-md border rounded-[5px]  bg-white mt-5 min-w-[185px]">
      <li className="p-2 border-b hover:text-secondary">
        <Link href={"/inbox"}>
          <a className="text-primary text-[14px] font-lota font-normal">
            Inbox
          </a>
        </Link>
      </li>
      <li className="p-2 border-b hover:text-secondary">
        <Link href={"/profile?tab=rentals"}>
          <a className="text-primary text-[14px] font-lota font-normal">
            Rentals
          </a>
        </Link>
      </li>
      <li className="p-2 border-b hover:text-secondary">
        <Link href={"/favorites"}>
          <a className="text-primary text-[14px] font-lota font-normal">
            Favorites
          </a>
        </Link>
      </li>
      <li className="p-2 border-b hover:text-secondary">
        <Link href={"/profile"}>
          <a className="text-primary text-[14px] font-lota font-normal">
            Profile
          </a>
        </Link>
      </li>
      <li className="p-2 border-b hover:text-secondary">
        <Link href={"/profile?tab=my-items"}>
          <a className="text-primary text-[14px] font-lota font-normal">
            My Items
          </a>
        </Link>
      </li>
      <li className="p-2 text-[#EB001B]">
        <button onClick={onLogout}>Log Out</button>
      </li>
    </ul>
  </>
);

const AuthLessMenu = () => (
  <ul className="shadow-md border rounded-[5px]  bg-white mt-5 min-w-[185px]">
    <li className="p-2 border-b hover:text-secondary">
      <Link href={"/faqs"}>
        <a className="text-primary text-[14px] font-lota font-normal">Faqs</a>
      </Link>
    </li>
    <li className="p-2 border-b hover:text-secondary">
      <Link href={"/auth/login"}>
        <a className="text-primary text-[14px] font-lota font-normal">Login</a>
      </Link>
    </li>
    <li className="p-2 border-b hover:text-secondary">
      <Link href={"/auth/signup"}>
        <a className="text-primary text-[14px] font-lota font-normal">
          Sign Up
        </a>
      </Link>
    </li>
  </ul>
);

function NavBar() {
  const { isAuthenticated, user, onLogout } = useAuth();
  const [visibleModal, setVisibleModal] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showAccountDeleteWarning, setShowAccountDeleteWarning] =
    useState(false);
  const [deleteUserAccount, { loading }] = useMutation(DELETE_ACCOUNT, {
    onCompleted(data) {
      notification.success({
        message: data.message,
      });
      setVisibleModal(false);
      onLogout?.();
    },
    onError(error) {
      notification.error({
        message: error.message,
      });
    },
  });

  return (
    <>
      <div className="container">
        <nav className="w-full flex justify-between items-center py-5">
          <div className="text-primary text-2xl font-semibold">
            <Link href={"/"}>
              <a className="hover:text-primary block xs:w-auto w-20">
                <img
                  src="/images/logos/shuut-logo.png"
                  className="object-cover max-w-full sm:h-10"
                  alt="shuut"
                />
              </a>
            </Link>
          </div>
          <ul className="flex items-center ml-auto gap-x-10">
            <div className="hidden lg:flex gap-x-10">
              <NavLinkItem label="How It Works" href="/how-it-works" />
              <NavLinkItem label="FAQs" />
              <NavLinkItem label="List Item" href="/list-item" />
              <NavLinkItem label="Cart" href="/cart" />
            </div>
            {isAuthenticated ? (
              <>
                <div className="md:ml-32 hidden sm:block bg-[#FAFCFF] border border-[#D0CFD8] border-opacity-10 py-2 px-4 rounded-[10px] bg-opacity-40">
                  <Dropdown
                    overlay={<Menu onLogout={() => setVisibleModal(true)} />}
                    trigger={["click"]}
                  >
                    <div className="flex items-center font-semibold font-lota cursor-pointer">
                      <div className="">
                        <Avatar size={40}>
                          <span className="uppercase font-bold text-primary">
                            {user?.firstName.charAt(0).toUpperCase()}
                          </span>
                        </Avatar>
                      </div>
                      <h1 className="px-5">
                        {user?.firstName} {user?.lastName}
                      </h1>
                      <MdOutlineKeyboardArrowDown className="text-xl" />
                    </div>
                  </Dropdown>
                </div>
                <Dropdown
                  overlay={<Menu onLogout={() => setVisibleModal(true)} />}
                  trigger={["click"]}
                  className="md:hidden"
                >
                  <RiMenu3Fill className="text-2xl" />
                </Dropdown>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-10">
                  <NavLinkItem
                    label="Login"
                    href="/auth/login"
                    liClass="ml-32"
                  />
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
      <Modal
        visible={visibleModal}
        onCancel={() => {
          setVisibleModal(false);
          setShowAccountDeleteWarning(false);
        }}
        maskClosable={false}
      >
        <div className="flex flex-col justify-center items-center py-4">
          {showAccountDeleteWarning ? (
            <>
              <img
                src="/images/bulb.png"
                alt="bulb"
                className="mb-5 w-[55px] h-[55px]"
              />
              <h2 className="font-lota font-semibold text-4xl mb-3">
                Delete Account
              </h2>
              <p className="text-2xl text-[#898CA6] font-normal font-lota">
                Remove this data from system
              </p>
              <p className="text-base text-center font-normal font-lota my-5 text-[#010918]">
                Deleting your account will remove all stats and data from our
                system and your account details unavailable, you will require a
                new registration in the future to use the SHUUT.
              </p>
              <div className="relative w-[70%]">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={visiblePassword ? "text" : `password`}
                  placeholder="Enter Password"
                  className="py-3 border-b border-[#E8E8E8] outline-none focus:outline-none !bg-white w-full"
                />
                <span
                  className="cursor-pointer absolute bottom-4 right-3"
                  onClick={() => setVisiblePassword((p) => !p)}
                >
                  {visiblePassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <Button
                onClick={async () => {
                  if (password && user?.email) {
                    await deleteUserAccount({
                      variables: {
                        password,
                        email: user?.email,
                      },
                    });
                  }
                }}
                loading={loading}
                className="w-[70%] bg-secondary text-white h-12 rounded-lg flex justify-center items-center mt-8"
              >
                Delete
              </Button>
            </>
          ) : (
            <>
              <img
                src="/images/bulb.png"
                alt="bulb"
                className="mb-5 w-[55px] h-[55px]"
              />
              <h2 className="font-lota font-semibold text-4xl mb-3">Log Out</h2>
              <p className="text-2xl text-[#898CA6] font-normal font-lota">
                Sign off SHUUT
              </p>
              <p className="text-2xl font-normal font-lota my-5">
                Are you sure you want to Logout?
              </p>
              <Button
                onClick={onLogout}
                className="w-[80%] bg-secondary text-white h-12 rounded-lg flex justify-center items-center mb-4"
              >
                Yes, proceed
              </Button>
              <button
                onClick={() => setShowAccountDeleteWarning(true)}
                className="text-2xl text-[#898CA6] font-semibold font-lota"
              >
                Delete My Account Permanetly
              </button>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

export default NavBar;
