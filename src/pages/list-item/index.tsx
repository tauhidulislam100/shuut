import { BsArrowLeftCircle } from "react-icons/bs";
import { Footer, NavBar } from "../../components";
import Image from 'next/image';
import { listItemCat, listItemGetstarted, listItemRenting } from "../../data";
import { NextPage } from "next";
import { Widget } from "@uploadcare/react-widget";
const ListItem:NextPage = () => {

    return (
        <div className="">
            <div className="container">
                <NavBar />
                <div className="">
                    <button className='text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center'>
                        <span className='mr-2 text-secondary'><BsArrowLeftCircle /></span>
                        back
                    </button>
                    <div className="py-20 md:px-24 md:flex">
                        <div className="w-[450px]">
                            <h1 className="text-[50px] font-semibold text-primary leading-[60px]">
                                Start Earning On 
                                <span className="uppercase block">Shuut</span>
                            </h1>
                            <p className="text-2xl text-body mt-12">
                                More than 1,000 listings available on 
                                shuut, and is the first place to renters comes for all camera equipments
                            </p>
                            <button className="mt-7 bg-secondary hover:bg-primary h-[48px] w-[193px]  !text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                                List An Item
                            </button>
                        </div>
                        <div>
                            <div className="relative h-full">
                                <Image 
                                    src="/images/list-item/money.png" 
                                    width={724} 
                                    height={454}
                                    className="object-fit translate-y-10" 
                                    alt="Cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-[411px] bg-gradient-radial from-secondary to-primary flex justify-center items-center">
                <div className="text-white text-center space-y-[30px] px-[10%]">
                    <h1 className="text-[32px] font-semibold text-inherit">We’ve Got You Covered</h1>
                    <p className="text-inherit text-2xl">We take safety seriously, Every borrower in our marketplace gets verified by our team and should things go wrong, our item guarantee has your back.</p>
                    <div className="flex flex-col justify-center items-center">
                        <h2 className="text-inherit">In Partnership With</h2>
                        <div className="flex gap-5 mt-[30px]">
                            {
                                Array(5).fill('').map((v, idx) => (
                                    <div key={idx} className="leadway">
                                        <Image 
                                            src={'/images/list-item/leadway.png'} 
                                            alt="Logo"
                                            width={82}
                                            height={62}
                                              />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[#F8F8F8]">
                <div className="container py-[70px]">
                    <div className="md:pl-24">
                        <h1 className="text-[32px] font-semibold text-primary">Getting Started</h1>
                        <div className="md:pl-4 space-y-5 sm:space-y-0 sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-[30px]">
                            {
                                listItemGetstarted.map((itm, idx) => (
                                    <div key={`get_${idx}`} className="p-6 bg-white rounded">
                                        <div className="">
                                            <h1 className="my-7 text-[#1F1F1F] text-2xl font-extrabold">{itm.title}</h1>
                                            <p className="text-[#64607D]">{itm.description}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex justify-center mt-[60px]">
                            <button className=" bg-secondary hover:bg-primary h-[48px] w-[193px]  !text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                                List An Item
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[#F8F8F8]">
                <div className="container py-[70px]">
                    <div className="md:pl-24">
                        <h1 className="text-[32px] font-semibold text-primary">Categories</h1>
                        <div className="sm:grid grid-cols-4 gap-5 mt-[30px]">
                            {
                                listItemCat.map((cat, idx) => (
                                    <div key={`cat_${idx}`} className="bg-white rounded-md">
                                        <div className="px-4 pt-3">
                                            <div className="relative w-full rounded-[5px] overflow-hidden h-[220px]">
                                                <Image src={cat.cat_img} alt="Cat Img" className="object-cover hover:scale-105 w-full h-[219px] transition-all duration-300" layout="fill" />
                                            </div>
                                            <h3 className="my-3.5 text-primary-100 text-sm font-medium">{cat.title}</h3>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gradient-radial from-secondary to-primary">
                <div className="container py-[70px] text-white text-center">
                    <h1 className="text-[32px] font-semibold text-inherit">How Renting Works</h1>
                    <p className="mt-[30px] text-2xl">4 Easy steps to get going with rent on SHUUT.</p>
                    <div className="md:grid grid-cols-4 mt-[30px]">
                        {
                            listItemRenting.map((step, idx) => (  
                                <div key={`step_${idx}`}  className="">
                                    <div className="">
                                        <h1 className="text-[69px] font-extrabold text-inherit">{ idx + 1 }</h1>
                                        <h3 className="text-lg font-semibold text-inherit mt-5 mb-4">{step.title}</h3>
                                        <p className="text-[17px] font-light text-inherit">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex justify-center mt-[60px]">
                        <button className=" bg-white hover:bg-secondary  h-[48px] w-[193px] text-secondary hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                            List An Item
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
};

export default ListItem;