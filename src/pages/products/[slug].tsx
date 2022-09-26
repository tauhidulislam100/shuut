import { Avatar, Carousel, Popover, Tabs } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import React, { useRef, useState } from 'react'
import { BsArrowLeftCircle, BsInstagram, BsTelephone, BsTwitter } from 'react-icons/bs';
import { ImFacebook } from 'react-icons/im';
import { BiMinus } from 'react-icons/bi';
import { IoIosAdd, IoIosArrowDown, IoIosArrowUp, IoIosClose } from 'react-icons/io';
import { FaTelegramPlane } from 'react-icons/fa';
import { TbMail } from 'react-icons/tb';
import { Modal, NavBar, RattingBar, SingleProduct } from '../../components';
import { Niger } from '../../components/icons';
import { tripodInLagos } from '../../data';

const { TabPane } = Tabs;

const PopoverContent = () => (
    <div className='max-w-[350px] p-4 pt-8'>
        <h4 className='text-lota font-[15px] text-white'>Saftey Tips</h4>
        <ul className='list-disc text-xs text-white font-normal font-sofia-pro mt-3 ml-5'>
            <li>Please ask for availabilyt before booking</li>
            <li>Be sure to read the instructions carefully</li>
            <li>Late return over 24hrs will be charged as perday.</li>
            <li>Inspect what you’re going to buy to make sure it is
                what you need.</li>
        </ul>
        <button className='ml-auto flex w-[77px] h-8 rounded-md text-primary items-center justify-center bg-white mt-4'>
            Got it
        </button>
    </div>
);

const ProductView = () => {
    
    const carouselRef = useRef<CarouselRef>(null);
    const [availability, setAvailability] = useState(false);
    const [selectedImage, setSelectedImage] = useState('/images/product-1.png');

    const goUp = () => {
        carouselRef.current?.next();
    }

    const goDown = () => {
        carouselRef.current?.prev();
    }

    const preview = (index = 1, image = '/images/product-1.png') => {
        carouselRef.current?.goTo(index);
        setSelectedImage(image);
    }

    return (
        <div className="bg-[#F8F8F8] min-h-screen">
            <div className="container">
                <NavBar />
            </div>
            <Modal onCancel={()=> setAvailability(false)} visible={availability}>
                <div className="">
                    Calendar
                </div>
            </Modal>
            <section className='border-t border-[#D0CFD8] border-opacity-30 pt-5 mb-14'>
                <div className="container">
                    <button className='text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center'>
                        <span className='mr-2 text-secondary'><BsArrowLeftCircle /></span>
                        back
                    </button>
                    <div className="grid grid-cols-3 gap-8 mt-14">
                        <div className="col-span-2 flex gap-x-8 h-[660px] py-6 relative">
                            <button onClick={goUp} className='absolute top-0 left-[14%] z-10 text-primary text-opacity-40 text-xl'>
                                <IoIosArrowUp />
                            </button>
                            <button onClick={goDown} className='absolute bottom-0 left-[13%] z-20 text-primary text-opacity-40 text-xl'>
                                <IoIosArrowDown />
                            </button>
                            <div className='w-[30%] relative overflow-hidden'>
                                <Carousel 
                                    ref={carouselRef} 
                                    className='product-carousel' 
                                    slidesToShow={3.5}
                                    vertical={true}
                                    infinite={false} 
                                    arrows={false} 
                                    dots={false}>
                                    {[...Array(10)].map((_, index) => (
                                        <div key={index} onClick={() => preview(index, '/images/product-1.png')} className='w-full bg-white  rounded-sm p-[2px] overflow-hidden'>
                                            <img className='w-full object-cover h-[143px] rounded-sm' src='/images/product-1.png' />
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                            <div className='w-[70%] bg-white p-8 rounded-md box-border'>
                                <div className='box-border border border-[#F4F4F4] rounded-md px-4 py-10 h-[550px]'>
                                    <img src={selectedImage} className="max-w-full object-cover h-full w-full rounded-md" />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className='font-medium text-primary-100 font-sofia-pro text-xl'>Video CameraREWK17</h3>
                                <div className="inline-flex items-center bg-white rounded-md px-2 w-20 justify-between">
                                    <button className='text-xl'>
                                        <IoIosAdd />
                                    </button>
                                    <input className='focus:outline-none py-2 w-[10px] text-center text-black font-medium font-sofia-pro' placeholder='1' />
                                    <button className='text-xl'>
                                        <BiMinus />
                                    </button>
                                </div>
                            </div>
                            <Popover content={<PopoverContent />}
                                placement="leftTop"
                                overlayClassName='price-popover'>
                                <div className="bg-white rounded-md p-4 mb-4 relative h-[285px]">
                                    <button className='absolute top-3 right-3 rounded-full w-6 h-6 inline-grid place-items-center border border-[#F4F4F4]'>
                                        <IoIosClose />
                                    </button>
                                    <Tabs className='price-tabs'>
                                        <TabPane key="1" tab="Monthly Price">
                                            <div className="flex items-center">
                                                <p className='inline-flex items-center text-lg font-sofia-pro text-secondary'><span><Niger /></span> 300,000/days </p>
                                                <p className='text-lg font-sofia-pro text-secondary mx-2'>-</p>
                                                <p className='inline-flex items-center text-lg font-sofia-pro text-secondary'><span><Niger /></span> 300,000</p>
                                            </div>
                                            <p className='text-sm my-5 text-primary-100 text-opacity-90'>We’ve analysed prices for Video CameraREWK17 from all renters on SHUUT.</p>
                                            <p className='text-sm text-primary-100 text-opacity-90'>The advert price is above average.</p>
                                            <div className="mt-6 flex justify-center">
                                                <button onClick={() => setAvailability(true)} className='font-sofia-pro px-7 bg-secondary rounded-md text-white h-8 inline-flex items-center text-sm font-medium'>
                                                    Check Availabilty
                                                </button>
                                            </div>
                                        </TabPane>
                                        <TabPane key="2" tab="Weekly Price">
                                        </TabPane>
                                        <TabPane key="3" tab="Daily Price">
                                        </TabPane>
                                    </Tabs>
                                </div>
                            </Popover>
                            <div className="bg-white rounded-[5px] mb-5">
                                <div className="px-6 py-5 text-[#0A2429E5] space-y-2.5">
                                    <div className="flex justify-between">
                                        <h4 className="font-sofia-pro text-[#0A2429] text-xl font-medium">Days</h4>
                                        <h5 className="font-sofia-pro text-sm text-[#286EE6]">Chagne</h5>
                                    </div>
                                    <div className="flex justify-between">
                                        <h4 className="">14 September</h4>
                                        <div className="">-</div>
                                        <h5 className="">24 September</h5>
                                    </div>
                                    <div className="flex justify-between">
                                        <h4 className="">Total Cost Per Day</h4>
                                        <h5 className="">$400,000</h5>
                                    </div>
                                    <div className="flex justify-between">
                                        <h4 className="">Service Fee</h4>
                                        <h5 className="">$400,000</h5>
                                    </div>
                                    <div className="flex justify-between">
                                        <h4 className="">Total</h4>
                                        <h5 className="">$400,000</h5>
                                    </div>
                                    <div className="mt-6 flex justify-end gap-5">
                                        <button className='w-[133px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-8 items-center text-sm font-medium'>
                                            Add Cart
                                        </button>
                                        <button className='w-[133px] font-sofia-pro bg-secondary rounded-md text-white h-8 items-center text-sm font-medium'>
                                            Book Now
                                        </button>
                                    </div>
                                    <p className="text-[#EB001B]">48 hours cooling off period</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-md p-4 mb-4 h-[180px]">
                                <h3 className='text-xl text-primary-100 font-medium font-sofia-pro mb-6'>Description</h3>
                                <p className='text-sm text-primary-100 text-opacity-90'>Second Condition</p>
                            </div>
                            <div className="bg-white rounded-md p-4  h-[98px] flex">
                                <Avatar size={68} />
                                <div className='ml-4 w-[75%]'>
                                    <div className="flex items-center justify-between">
                                        <h4 className='text-xl text-primary-100 font-lota'>B.B</h4>
                                        <div className='flex items-center'>
                                            <RattingBar ratting={4.5} className='text-[#FFCB45]' />
                                            <h3 className='ml-[2px] text-[#286EE6] text-sm font-normal font-sofia-pro'>17 Reviews</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <a href="#" className='inline-grid place-items-center w-[25px] h-[25px] rounded-full social-bg-gradient text-white text-sm'>
                                            <ImFacebook />
                                        </a>
                                        <a href="#" className='inline-grid place-items-center w-[25px] h-[25px] rounded-full social-bg-gradient text-white text-sm'>
                                            <BsInstagram />
                                        </a>
                                        <a href="#" className='inline-grid place-items-center w-[25px] h-[25px] rounded-full social-bg-gradient text-white text-sm'>
                                            <FaTelegramPlane />
                                        </a>
                                        <a href="#" className='inline-grid place-items-center w-[25px] h-[25px] rounded-full social-bg-gradient text-white text-sm'>
                                            <BsTwitter />
                                        </a>
                                        <a href="#" className='inline-grid place-items-center w-[25px] h-[25px] rounded-full social-bg-gradient text-white text-sm'>
                                            <TbMail />
                                        </a>
                                        <a href="#" className='inline-grid place-items-center w-[25px] h-[25px] rounded-full social-bg-gradient text-white text-sm'>
                                            <BsTelephone />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-8">
                        <div className="col-span-2 rounded-md overflow-hidden">
                            <h4 className='text-xl font-medium font-sofia-pro text-primary-100 mb-4'>Map Location</h4>
                            <img src="/images/map-1.png" className='w-full h-[293px] object-cover rounded-md' />
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className='text-xl font-medium font-sofia-pro text-primary-100'>Reviews</h4>
                                <a href="#" className='text-sm text-[#286EE6] font-normal font-sofia-pro'>See All</a>
                            </div>
                            <div className="bg-white rounded-md p-4 pb-8 h-[293px]">
                                <div className="flex mb-5">
                                    <Avatar size={41} />
                                    <div className="ml-3 w-[90%]">
                                        <h4 className='text-[15px] font-sofia-pro text-primary-100 flex items-center justify-between'>
                                            Jane Doe
                                            <span>05 August 2022</span>
                                        </h4>
                                        <RattingBar ratting={4.5} className='!text-[#FFCB45]' />
                                        <p className='text-sm font-sofia-pro text-primary-100 mt-4'>
                                            05 August 2022 We’ve analysed prices for Video CameraR....
                                            from all renters on SHUUT.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <Avatar size={41} />
                                    <div className="ml-3 w-[90%]">
                                        <h4 className='text-[15px] font-sofia-pro text-primary-100'>Jane Doe</h4>
                                        <RattingBar ratting={4.5} className='!text-[#FFCB45]' />
                                        <p className='text-sm font-sofia-pro text-primary-100 mt-4'>
                                            05 August 2022 We’ve analysed prices for Video CameraR....
                                            from all renters on SHUUT.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='mb-14'>
                <div className="container">
                    <h4 className='text-xl font-medium font-sofia-pro text-primary-100 mb-4'>Other Listing From Owner</h4>
                    <div className="grid grid-cols-5 gap-5">
                        {
                            tripodInLagos.slice(0,5).map((pd, idx) => <SingleProduct key={`product_index_${idx}`} data={pd} />)
                        }
                    </div>
                </div>
            </section>
            <section className='pb-14'>
                <div className="container">
                    <h4 className='text-xl font-medium font-sofia-pro text-primary-100 mb-4'>Other Listing From Camera</h4>
                    <div className="grid grid-cols-5 gap-5">
                        {
                            tripodInLagos.slice(0,5).map((pd, idx) => <SingleProduct key={`product_index_${idx}`} data={pd} />)
                        }
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProductView;