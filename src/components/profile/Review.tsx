import { Progress, Rate } from 'antd';
import { Input } from 'antd';
import Image from 'next/image';
import React from 'react';

const { TextArea } = Input;
const ReviewDetails = () => {
    return (
        <div className="flex items-center justify-end">
            <Progress 
                percent={90} 
                strokeColor={'#2DA771'}
                strokeWidth={10}
                showInfo={false}
                className="pt-1"
            />
            <div className="w-full pl-5">
                <Rate defaultValue={4} disabled />
            </div>
            <div className="pt-2">4132</div>
        </div>
    )
};

const Review = () => {

return (
    <div className="mt-[60px]">
        <h1 className="font-lota text-2xl font-semibold">Review</h1>
        <div className="mt-[60px] w-full flex justify-between items-center gap-10">
            <div className="w-[270px] h-[240px] border border-[#E7E7EC] shadow-md flex justify-center items-center">
                <div className="">
                    <h1 className="font-jost font-medium text-[60px]">4.93</h1>
                    <h5 className="text-lg font-jost font-medium">Average Ratings</h5>
                    <Rate defaultValue={5} disabled/>
                </div>
            </div>
            <div className="w-2/5">
                {
                    Array(4).fill('').map((_,idx) => <ReviewDetails key={idx} />)
                }
            </div>
        </div>
        <div className="mt-[60px]">
            <div className="flex">
                <div className="pr-5">
                    <Image 
                        src={'/images/profile.png'} 
                        alt={'Profile Image'}
                        width={80}
                        height={80}
                        className="rounded-full object-cover" />
                </div>
                <div className="text-[#77838F]">
                    <div className="flex justify-between items-center">
                        <div className="">
                            <h2 className="text-lg font-semibold text-primary">John Doe</h2>
                            <p className="">August 2022</p>
                        </div>
                        <div className="">
                            <Rate defaultValue={5} disabled/>
                        </div>
                    </div>
                    <p className="mt-4">
                        Ce module est bien expliqué grâce aux exemples 
                        concrets que Monsieur Hassan utilise à chaque fois 
                        quand il s&apos;agit du terrain. La structure 
                        du module est cohérente. Je félicite notre formateur 
                        pour son intelligence et sa passion.
                    </p>
                </div>
            </div>
        </div>
        <div className="mt-10">
            <div className="border shadow-lg p-14 rounded-md">
                <div className="font-lota">
                    <h1 className="text-lg font-semibold text-primary">John Doe</h1>
                    <p className="text-[#77838F] mt-4">Euro Production</p>
                    <Rate defaultValue={0} />
                    <h2 className="text-primary mt-3 mb-2">Comment</h2>
                    <TextArea 
                        rows={8} 
                        placeholder="Enter"
                        className='px-6 py-5 text-sm font-jost' />
                </div>
            </div>
            <div className="mt-10 flex justify-end">
                <button className='font-sofia-pro px-7 bg-secondary hover:bg-primary hover:shadow-md rounded-md text-white h-12 inline-flex items-center text-lg font-semibold'>
                    Post Comment
                </button>
            </div>
        </div>
    </div>
) 

};

export default Review;