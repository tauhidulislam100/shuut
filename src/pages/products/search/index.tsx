import React, { useState } from 'react'
import { IoIosSearch } from 'react-icons/io';
import { DatePicker, NavBar, SingleProduct } from '../../../components';
import { tripodInLagos } from '../../../data';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { RiEqualizerLine } from 'react-icons/ri';
import { MdChat } from 'react-icons/md';
import { BiCurrentLocation } from 'react-icons/bi';
import { link } from 'fs';
import { AutoComplete, Checkbox, Dropdown } from 'antd';

type dropItems = {
    label: string, value: string
}
type dropdownProps = {
    dropdownData: dropItems[]
}

const DropdownBody = ( {dropdownData}:dropdownProps ) => {
    return (
    <ul className="bg-white shadow-lg rounded-lg">
        {
            dropdownData.map((itm:dropItems, idx:number) => (
            <li key={`dropdown_${idx}_${itm.value}`} className="text-sm font-lota border-b-[1.5px] text-[#969696]">
                <Checkbox value={itm.value} className="text-[#969696] px-3.5 py-2.5">
                    {itm.label}
                </Checkbox>
            </li>
            ))
        }
    </ul>
    )
}

const mockVal = (str: string, repeat = 1) => ({
    value: str.repeat(repeat),
  });

const ProductSearch = () => {

    const [filter, setFilter] = useState('');
    const [value, setValue] = useState('');
    const [options, setOptions] = useState<{ value: string }[]>([]);

    const onSearch = (searchText: string) => {
        setOptions(
        !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
        );
    };

    const onSelect = (data: string) => {
        console.log('onSelect', data);
    };

    const onChange = (data: string) => {
        setValue(data);
    };


    return (
        <>
            <div className="container">
                <NavBar />
            </div>
            <div className="bg-[#FFFFFF] border-t border-[#D0CFD8] border-opacity-30 pt-4 pb-10">
                <div className="container">
                    <div className="">
                        <button className='text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center'>
                            <span className='mr-2 text-secondary'><BsArrowLeftCircle /></span>
                            back
                        </button>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="mt-5 flex items-center w-[430px] max-w-full border border-body-light rounded-lg p-[2px] relative">
                            {/* <input className='min-w-max px-10 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light bg-transparent' /> */}
                            <AutoComplete 
                                placeholder='Search...'
                                dropdownMatchSelectWidth={425}
                                options={options}
                                onSelect={onSelect}
                                onSearch={onSearch} 
                                className='min-w-max w-full h-full text-xl search-auto-complete' />
                            <button className='px-7 h-12 bg-secondary text-white min-w-max rounded-r-lg'>
                                Find Gear
                            </button>
                            <span className='absolute top-4 left-4 text-lg text-[#263238]'>
                                <IoIosSearch />
                            </span>
                        </div>
                        <div className="flex items-center gap-5">
                            <button onClick={() => setFilter('category')} className={`min-w-[121px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] hover:border-secondary rounded-md text-[#0A2429] hover:text-secondary h-12 items-center ${filter === 'category'}`}>
                                Category
                            </button>
                            <button onClick={() => setFilter('location')} className={`min-w-[121px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] hover:border-secondary rounded-md text-[#0A2429] hover:text-secondary h-12 items-center ${filter === 'category'}`}>
                                Location
                            </button>
                            <button onClick={() => setFilter('date')} className={`min-w-[121px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] hover:border-secondary rounded-md text-[#0A2429] hover:text-secondary h-12 items-center ${filter === 'category'}`}>
                                Date
                            </button>
                            <Dropdown arrow trigger={['click']} overlay={<DropdownBody dropdownData={[
                                {label: 'Distance-Nearest First', value: 'distance_nearest'},
                                {label: 'Relevance', value: 'relevance'},
                                {label: 'Price (Cheapest First)', value: 'price'}
                                ]} />} >
                                <button onClick={() => setFilter('')} className="text-[#0A2429] hover:text-secondary">
                                    <RiEqualizerLine className='text-3xl' />
                                </button>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="">
                        {
                            filter === '' && (
                                <div className="space-y-5 md:grid grid-cols-3 gap-7 mt-10">
                                    <div className="col-span-2 sm:grid grid-cols-2 md:grid-cols-3 gap-5">
                                        {
                                            tripodInLagos.slice(9).map(product => <SingleProduct key={product.title} data={product} />)
                                        }
                                    </div>
                                    <div className="col-span-1">
                                        <img src="/images/map-view.png" alt="map" className='object-cover max-w-full w-full' />
                                    </div>
                                </div>
                            )
                        }
                        {
                            filter === 'category' && (
                                <div className="">
                                    <h1 className="text-2xl font-lota font-semibold mt-5">Category</h1>
                                    <div className="flex flex-wrap gap-10 mt-5 px-16">
                                        {
                                            Array(12).fill('').map((_, idx) => (
                                                <div key={idx} className="">
                                                    <div className="w-36 h-36 font-lota bg-[#9D9D9D]/10 text-[#0A2429] rounded-full flex justify-center items-center">
                                                        <MdChat className='text-5xl' />
                                                    </div>
                                                    <h4 className="text-center text-2xl mt-5">Camera</h4>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                        }
                        {
                            filter === 'location' && (
                                <div className="mt-10">
                                    <h1 className="text-2xl">Select Location</h1>
                                    <div className="mt-10">
                                        <div className="py-3 px-7 text-white flex items-center border rounded-[5px]">
                                            <div className="pr-3">
                                                <BiCurrentLocation className='text-xl text-primary' />
                                            </div>
                                            <div className="text-[#263238] font-sofia-pro">
                                                <h3 className="text-sm">Select My Location</h3>
                                                <p className="text-xs font-light mt-2">We will show you items near you sorted by distance</p>
                                            </div>
                                        </div>
                                    </div>
                                    <h1 className="mt-7 font-lota text-2xl text-[#0A2429]">Popular</h1>
                                    <ul className="mt-7">
                                        {
                                            [
                                                'Kaduna',
                                                'Abia',
                                                'Jos',
                                                'Port-Harcourt',
                                                'Abuja',
                                                'Ogun'
                                            ].map((itm, idx) => <li className="text-lg py-2.5 font-lota text-[#0A2429]" key={idx}>{itm}</li> )
                                        }
                                    </ul>
                                </div>
                            )
                        }
                        {
                            filter === 'date' && (
                                <div className="mt-10">
                                    <h1 className="text-2xl">Date</h1>
                                    <div className="mt-5 flex justify-center items-center">
                                        <div className="shadow rounded-lg">
                                            <DatePicker />
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    ) 
}

export default ProductSearch;