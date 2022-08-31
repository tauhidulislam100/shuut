import React from 'react';
import { IoIosSearch } from 'react-icons/io';
import { RiEqualizerLine } from 'react-icons/ri';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import SingleProduct from '../products/SingleProduct';

const Rental = () => {

return (
    <>
        <div className="mt-[60px] w-full flex justify-between">
            <div className="">
                <div className="flex items-center w-[430px] max-w-full border border-body-light rounded-lg p-[2px] relative">
                    <input placeholder='Search...' className='min-w-max px-10 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light bg-transparent' />
                    <button className='px-7 h-12 bg-secondary text-white min-w-max rounded-r-lg'>
                        Find Gear
                    </button>
                    <span className='absolute top-4 left-4 text-lg text-[#263238]'>
                        <IoIosSearch />
                    </span>
                </div>
            </div>
            <div className="space-x-2">
                <button className="px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] border-[#D0CFD84D] rounded-md font-lota">New Request</button>
                <button className="px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] border-[#D0CFD84D] rounded-md font-lota">Handover Today</button>
                <button className="px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] border-[#D0CFD84D] rounded-md font-lota">Handover Tomorrow</button>
                <button className="px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] border-[#D0CFD84D] rounded-md font-lota">List View</button>
                <div className="text-3xl text-[#3E4958]">
                    <RiEqualizerLine />
                </div>
            </div>
        </div>
        <div className="w-full mt-[60px] flex justify-end">
            <button className="bg-secondary text-white font-lota rounded-md px-8 py-2.5 flex items-center">
                <AiOutlineCloudDownload className='mr-2 text-lg' />
                Download
            </button>
        </div>
        <div className="">
            <h1 className="text-2xl text-primary">Today</h1>
            <div className="grid grid-cols-4">
                {
                    Array(8).fill('').map((_,idx) => <SingleProduct key={`today_${idx}`} />)
                }
            </div>
        </div>
    </>
) 

};

export default Rental;