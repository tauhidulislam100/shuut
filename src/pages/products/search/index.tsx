import React from 'react'
import { IoIosSearch } from 'react-icons/io';
import { NavBar, SingleProduct } from '../../../components';

const ProductSearch = () => {
    return (
        <>
            <div className="container">
                <NavBar />
            </div>
            <div className="bg-[#F8F8F8] border-t border-[#D0CFD8] border-opacity-30 pt-4 pb-10">
                <div className="container">
                    <div className="flex items-center w-[430px] max-w-full border border-body-light rounded-lg p-[2px] relative">
                        <input placeholder='Search...' className='min-w-max px-10 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light bg-transparent' />
                        <button className='px-7 h-12 bg-secondary text-white min-w-max rounded-r-lg'>
                            Find Gear
                        </button>
                        <span className='absolute top-4 left-4 text-lg text-[#263238]'>
                            <IoIosSearch />
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-7 mt-10">
                        <div className="col-span-2 grid grid-cols-3 gap-5">
                            <SingleProduct />
                            <SingleProduct />
                            <SingleProduct />
                            <SingleProduct />
                            <SingleProduct />
                            <SingleProduct />
                            <SingleProduct />
                            <SingleProduct />
                            <SingleProduct />
                        </div>
                        <div className="col-span-1">
                            <img src="/images/map-view.png" alt="map" className='object-cover max-w-full w-full' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductSearch;