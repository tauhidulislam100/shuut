import React from 'react'
import { FiHeart } from 'react-icons/fi';
import { Niger } from '../icons';
import RattingBar from '../ratting-bar/RattingBar';

const SingleProduct = () => {
    return (
        <div className='bg-white rounded-[4px] p-4'>
            <div className='h-[176px] border border-[#F4F4F4] rounded-[6px] p-3 mb-2 relative'>
                <img src='/images/product-1.png' className='object-cover w-full h-full rounded-[4px]' />
                <button className='absolute top-6 right-5 w-6 h-6 rounded-full grid place-items-center bg-[#E6EFFB] text-primary text-xs hover:text-red-600'>
                    <FiHeart />
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

export default SingleProduct;