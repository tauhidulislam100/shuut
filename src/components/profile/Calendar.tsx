import React from 'react';
import { IoIosSearch } from 'react-icons/io';
import { RiEqualizerLine } from 'react-icons/ri';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import SingleProduct from '../products/SingleProduct';

const Calendar = () => {

return (
    <>
        <div className="w-full mt-[60px] flex justify-end gap-2">
            <button className="px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] border-[#D0CFD84D] rounded-md font-lota">Check Dates</button>
            <button className="px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] border-[#D0CFD84D] rounded-md font-lota">Today</button>
            <button className="px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] border-[#D0CFD84D] rounded-md font-lota">Unavailability</button>
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

export default Calendar;