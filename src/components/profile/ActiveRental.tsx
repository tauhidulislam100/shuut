import { Collapse } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsPlus, BsX } from "react-icons/bs";



const ActiveRental = () => {

    return (
        <div className="font-lota">
            <h1 className="text-[32px] text-primary">Rentals</h1>
            <div className="mt-5">
                <div className="space-y-10 md:space-y-0 md:flex gap-10">
                    {/* Right */}
                    <div className="flex-1 bg-[#F8F8F8] rounded-[5px] overflow-hidden border">
                        <div className="border-b p-5">
                            <h3 className="text-primary font-semibold">Action Required</h3>
                        </div>
                        <div className="flex justify-between items-center p-5">
                            <div className="flex items-center">
                                <div className="relative">
                                    <Image src={'/images/camera1.png'} width={166} height={129} alt="Rental" />
                                </div>
                                <h5 className="text-primary-100 pl-4">Sony Camera</h5>
                            </div>
                            <div className="">
                                <p className="text-primary-100/30">
                                    19th May - 24th June 2022
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end px-5 -translate-y-1/2">
                            <div className="flex items-center gap-2.5">
                                <div className="relative">
                                    <Image src={'/images/profile.png'} width={50} height={50} alt="Profile Pic" />
                                </div>
                                <h4 className="text-primary-100/30">John Doe</h4>
                            </div>
                        </div>
                        <button className="bg-secondary text-white w-full hover:bg-primary py-2.5 text-sm font-sofia-pro">
                            Pending Availability Confirmation
                        </button>
                    </div>
                    <div className="flex-1 bg-[#F8F8F8] rounded-[5px] overflow-hidden border p-5">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="relative">
                                    <Image src={'/images/camera1.png'} width={166} height={129} alt="Rental" />
                                </div>
                                <h5 className="text-primary-100 pl-4">Sony Camera</h5>
                            </div>
                            <div className="">
                                <p className="text-primary-100">
                                    19th May - 24th June 2022
                                </p>
                            </div>
                        </div>
                        <h2 className="mt-9 font-sofia-pro font-medium text-primary-100">
                            Owned by John Doe
                        </h2>
                        <div className="mt-2.5 flex justify-between items-center">
                            <div className="flex items-center gap-2.5">
                                <div className="relative">
                                    <Image src={'/images/profile.png'} width={50} height={50} alt="Profile Pic" />
                                </div>
                                <h4 className="text-primary-100/30">Answers fast</h4>
                            </div>
                            <div className="">
                                <button onClick={() => console.log('button')} className="min-w-[155px] btn h-11 bg-secondary hover:bg-primary text-white">
                                    Message John
                                </button>
                            </div>
                        </div>
                        <div className="border-b my-10"></div>
                        <div className="font-lota px-5 text-sm">
                            <div className="flex justify-between items-center">
                                <h1 className="text-primary font-semibold">Payment Information</h1>
                                <h2 className="text-primary-100/30 underline">Invoice</h2>
                            </div>
                            <div className="flex justify-between items-center mt-12">
                                <p className="text-[#677489]">Cost of Service</p>
                                <p className="text-[#111729]">$56.00</p>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <p className="text-[#677489]">Total Rental Fee</p>
                                <p className="text-[#111729]">$8.00</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-[#677489]">VAT</p>
                                <p className="text-[#111729]">$8.00</p>
                            </div>
                            <div className="border-b mt-5 mb-2.5"></div>
                            <div className="flex justify-between items-center">
                                <p className="text-[#111729] text-sm">Total</p>
                                <p className="text-secondary text-sm font-semibold">$51.00</p>
                            </div>
                        </div>
                        <div className="border-b mt-10"></div>
                        <h1 className="mt-10 uppercase font-lota font-semibold text-primary">Faq</h1>
                        <div className="active-state">
                                <Collapse className='w-full faq-collapse' bordered={false} expandIconPosition='end' expandIcon={(p) =>
                                    p.isActive ? <span><BsX /></span> : <span><BsPlus /></span>
                                }>
                                    <Collapse.Panel key={'1'} header='How secured is my Equipment?'>
                                    <p>
                                        We are currently in the process of identifying interested founding members. When at least 100 have made a verbal commitment, the process of negotiating with potential partner nations can begin. There is no financial obligation until the founding members have approved a negotiated deal.
                                    </p>
                                    </Collapse.Panel>
                                    <Collapse.Panel key={'2'} header='Do renter pay for equipment transportation?'>
                                    <p>
                                        We are currently in the process of identifying interested founding members. When at least 100 have made a verbal commitment, the process of negotiating with potential partner nations can begin. There is no financial obligation until the founding members have approved a negotiated deal.
                                    </p>
                                    </Collapse.Panel>
                                    <Collapse.Panel key={'3'} header='How much money is needed for insurance ?'>
                                    <p>
                                        We are currently in the process of identifying interested founding members. When at least 100 have made a verbal commitment, the process of negotiating with potential partner nations can begin. There is no financial obligation until the founding members have approved a negotiated deal.
                                    </p>
                                    </Collapse.Panel>
                                    <Collapse.Panel key={'4'} header='What services are available on SHUUT?  '>
                                    <p>
                                        We are currently in the process of identifying interested founding members. When at least 100 have made a verbal commitment, the process of negotiating with potential partner nations can begin. There is no financial obligation until the founding members have approved a negotiated deal.
                                    </p>
                                    </Collapse.Panel>
                                </Collapse>
                        </div>
                        <h1 className="font-lota font-semibold text-primary">Support</h1>
                        <div className="border-b"></div>
                        <ul className="mt-10 space-y-2.5">
                            <li className="">
                                <Link href={'/item'}><a className="">Go To Item</a></Link>
                            </li>
                            <li className="">
                                <Link href={'/contact-support'}><a className="">Contact Support</a></Link>
                            </li>
                            <li className="">
                                <Link href={'/item'}><a className="">Change Date</a></Link>
                            </li>
                            <li className="">
                                <Link href={'/item'}><a className="text-[#EB001B]">Cancel</a></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
};


export default ActiveRental;