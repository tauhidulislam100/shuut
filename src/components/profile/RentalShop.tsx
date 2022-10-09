import React, { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { RiEqualizerLine } from 'react-icons/ri';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import SingleProduct from '../products/SingleProduct';
import Rental from './Rental';
import Calendar from './Calendar';

const RentalShop = () => {

    const [tab, setTAb] = useState('rental');

    const tabHandler = (text:string) => {
        setTAb(text);
    }

return (
    <div className="relative w-screen left-[calc(-50vw+50%)] px-[10%]">
        <div className="w-full flex justify-center mt-[60px]">
            <div className="bg-[#EAEAEA4D] flex flex-wrap justify-center gap-5 font-lota text-2xl border text-[#6C6C6C] border-[#D9D8E34D] rounded-[5px] py-3.5 px-7">
                <button onClick={() => tabHandler('rental')} className={`w-[201px] py-1  px-4 ${tab === 'rental' && 'shadow-md text-primary font-semibold rounded'}`}>Rentals</button>
                <button onClick={() => tabHandler('calendar')} className={`w-[201px] py-1  px-4 ${tab === 'calendar' && 'shadow-md text-primary font-semibold rounded'}`}>Calendar</button>
                <button onClick={() => tabHandler('item')} className={`w-[201px] py-1  px-4 ${tab === 'item' && 'shadow-md text-primary font-semibold rounded'}`}>My Items</button>
            </div>
        </div>
        {
            tab === 'rental' ? <Rental /> : <Calendar />
        }
    </div>
)  

};

export default RentalShop;