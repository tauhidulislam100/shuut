import React, { useState } from 'react';
import Image from 'next/image';
import { NavBar, SingleProduct } from '../components';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { tripodInLagos } from '../data';

const Favorite = () => {

    const [favorite, setFavorite] = useState(false);

    const noItem = (
        <>
            <div className="py-10 flex justify-center items-center">
                <Image 
                    src={'/images/favorite.png'}
                    alt="Profile Image"
                    width={297}
                    height={365}
                    />
            </div>
            <div className="flex justify-center mt-[60px]">
                <button onClick={() => setFavorite(!favorite)} className=" bg-secondary hover:bg-primary  h-[48px] w-[193px] text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                    Search Items
                </button>
            </div>
        </>
    );

    return (
    <div className="bg-[#F8FAFC4D]">
        <div className="container">
            <NavBar />
        </div>
        <div className="border-b" />
        <main className="container mt-5 mb-10">
            <button className='text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center'>
                <span className='mr-2 text-secondary'><BsArrowLeftCircle /></span>
                back
            </button>
            <div className="mt-20">
                <h1 className="text-primary text-[32px] font-semibold">Favorites</h1>
            </div>
            {
                !favorite ?
                noItem:
                <div className="grid grid-cols-5">
                    {
                        tripodInLagos.slice(0,10).map((itm, idx) => <SingleProduct key={`favorite_${idx}`} data={itm} />)
                    }
                </div>
            }
        </main>
    </div>
    )
};

export default Favorite;