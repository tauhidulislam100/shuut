import React, { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { RiEqualizerLine } from 'react-icons/ri';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import SingleProduct from '../products/SingleProduct';
import Rental from './Rental';
import Calendar from './Calendar';

const RentalShop = () => {
    const [tab, setTAb] = useState('rental');
    const tabHandler = () => {
        if(tab === 'rental'){
            setTAb('calendar');
        }else{
            setTAb('rental');
        }
    }
return (
    <div className="">
        <div className="w-full flex justify-center mt-[60px]">
            <div className="bg-[#EAEAEA4D] space-x-4 font-lota text-2xl border text-[#6C6C6C] border-[#D9D8E34D] rounded-[5px] py-3.5 px-7">
                <button onClick={tabHandler} className={`w-[201px] py-1  px-4 ${tab === 'rental' && 'shadow-md text-primary font-semibold rounded'}`}>Rentals</button>
                <button onClick={tabHandler} className={`w-[201px] py-1  px-4 ${tab === 'calendar' && 'shadow-md text-primary font-semibold rounded'}`}>Calendar</button>
            </div>
        </div>
        {
            tab === 'rental' ? <Rental /> : <Calendar />
        }
    </div>
)  

};

export default RentalShop;  (
    <div className="">
        Rental Shop
    </div>
)