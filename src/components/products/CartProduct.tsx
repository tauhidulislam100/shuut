import React from 'react'
import { FiHeart } from 'react-icons/fi';
import { Niger } from '../icons';
import RattingBar from '../ratting-bar/RattingBar';
import Image from 'next/image';
import { IoMdClose } from 'react-icons/io';

const CartProduct = () => {

    return (
        <div className='relative bg-white rounded-[5px] p-4 shadow-sm'>
            <div className='px-3 py-2.5 border border-[#F4F4F4] rounded-[6px] p-3 mb-2'>
                <div className="relative h-[176px]">
                    <Image 
                        src='/images/product-1.png' 
                        className='object-cover w-full h-full rounded'
                        alt='Product Image'
                        layout='fill' />
                </div>
                <button className='absolute top-0 right-0 w-7 h-7 border border-primary hover:border-red-600 rounded-full grid place-items-center text-primary text-xs hover:text-red-600'>
                    <IoMdClose />
                </button>
            </div>
            <div className="flex items-center justify-between">
                <h3 className='text-sm font-sofia-pro text-primary-100'>Picknfix</h3>
                <RattingBar ratting={4.5} className="!text-[8px]" />
            </div>
            <p className='text-xs font-noraml font-sofia-pro text-opacity-50 text-primary-100'>Video Camera REWK17</p>
            <div className="flex items-center text-base text-primary font-sofia-pro font-medium">
                <Niger />
                <span className='ml-1'>300,000/day</span>
            </div>
            <p className='text-xs font-noraml font-sofia-pro text-opacity-50 text-primary-100 mt-2'>Shomolu, Lagos</p>
        </div>
    );
}

export default CartProduct;