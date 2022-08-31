import React from 'react'
import { Footer, NavBar } from '../../components';
import Image from 'next/image';
import { hiwBeforeRental, hiwDuringRental } from '../../data';
import { NextPage } from 'next';

const HowItWorks:NextPage = () => {
    
    return (
        <>
            <header>
                <div className='container'>
                    <NavBar />
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h2 className='text-primary text-5xl md:text-[60px] font-semibold leading-[60px] max-w-[404px]'>
                                How To Rent On <span className="title-with-line pb-1">SHUUT</span>
                            </h2>
                            <p className='mt-12 text-2xl text-body opacity-80 max-w-[444px]'>Access items without owning them by renting them from people in your neighbourhood in a few easy steps.</p>
                        </div>
                        <div className="relative -mb-1.5">
                            <Image
                                className='object-cover -z-10'
                                width={642} 
                                height={670} 
                                src='/images/illustration-1.png' 
                                alt='illustration' />
                        </div>
                    </div>
                </div>
            </header>
            <section className="bg-gradient-radial from-secondary to-primary">
                <div className="container py-[70px] text-white">
                    <h2 className="text-lg font-medium text-inherit">Try SHUUT</h2>
                    <h1 className="mt-2.5 text-[32px] font-semibold text-inherit">Before The Rentals</h1>
                    <div className="mt-10 grid md:grid-cols-3 gap-6">
                        {
                            hiwBeforeRental.map((itm, idx) => (
                                <div key={`before_rental_${idx}`} className="flex gap-5">
                                    <div className="relative  w-[60px] min-w-[60px] h-[60px] rounded-full bg-white flex justify-center items-center">
                                        <Image src={itm.icon} alt="Icon" width={40} height={40} className="bg-center" />
                                    </div>
                                    <div className="">
                                        <h1 className="text-lg text-inherit font-sofia-pro font-semibold">{itm.title}</h1>
                                        <p className="text-sm font-sofia-pro">{itm.description}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex justify-center mt-[60px]">
                        <button className="transition-all duration-200 bg-white hover:bg-secondary  h-[48px] w-[193px] text-secondary hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                            List An Item
                        </button>
                    </div>
                </div>
            </section>
            <section className="bg-[#F8F8F8]">
                <div className="container pt-28 text-primary">
                    <h2 className="text-lg font-medium text-inherit">Try SHUUT</h2>
                    <h1 className="mt-2.5 text-[32px] font-semibold text-inherit">Before The Rentals</h1>
                    <div className="mt-10 flex justify-center gap-10 px-44">
                        {
                            hiwDuringRental.map((itm, idx) => (
                                <div key={`during_rental_${idx}`} className="bg-white rounded-[10px] border px-10 py-14">
                                    <div className="text-center">
                                        <div className="relative">
                                            <Image 
                                                src={itm.icon} 
                                                alt={"Icon"}
                                                width={100}
                                                height={100}
                                                className="object-cover rounded-full bg-body" />
                                        </div>
                                        <h1 className="text-primary my-[30px] text-lg font-semibold font-sofia-pro">{itm.title}</h1>
                                        <p className="font-sofia-pro text-body">{itm.description}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex justify-center mt-12">
                        <button className=" bg-secondary hover:bg-primary h-[48px] w-[193px]  !text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                            Browse Item
                        </button>
                    </div>
                </div>
            </section>
            <div className="">
                <div className="container flex justify-between items-center mt-[121px] mb-5">
                    <div className="">
                        <div className="max-w-[498px]">
                            <h1 className="font-semibold text-[32px]">Want To Make Some Money</h1>
                            <p className="mt-5 text-lg text-body">
                                Message and rent at the tap of a button. 
                                The Fat Llama app is the easiest way to find what you need, 
                                manage your rentals and purchases and get instant updates.
                                Get it now on iOS and Android.
                            </p>
                            <div className="flex justify-start mt-12">
                                <button className=" bg-secondary hover:bg-primary h-[48px] w-[193px]  !text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                                    Browse Item
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="relative">
                            <Image 
                                src={'/images/moneyverse.png'} 
                                alt={"Illustration"}
                                width={399}
                                height={350}
                                className="bg-bottom object-cover" />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default HowItWorks;