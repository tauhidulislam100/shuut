import React from 'react';
import { Footer, NavBar } from '../../components';
import { BsArrowLeftCircle } from 'react-icons/bs';
import Image from 'next/image';
import { Tabs } from 'antd';
import Activities from '../../components/profile/Activities';
import RentalShop from '../../components/profile/RentalShop';
import Settings from '../../components/profile/Settings';
import Review from '../../components/profile/Review';

const { TabPane } = Tabs;

const Profile = () => {

return (
    <div className="">
        <div className="container">
            <NavBar />
        </div>
        <main className="container">
            <div className="">
                <button className='text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center'>
                    <span className='mr-2 text-secondary'><BsArrowLeftCircle /></span>
                    back
                </button>
            </div>
            <section className="px-40">
                <h1 className="font-lota font-semibold text-[32px]">Profile</h1>
                <div className="relative mt-7 h-[233px] bg-profile-bg bg-no-repeat bg-cover rounded-md">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3">
                        <Image 
                            src={'/images/profile.png'}
                            alt="Profile Pic"
                            width={153}
                            height={153}
                            className="rounded-full bottom-0"
                            />
                    </div>
                </div>
                <h3 className="mt-[88px] font-lota text-lg text-center text-[#23262F]">
                    Videographer by day, night watcher by night
                </h3>
                <Tabs className='profile-tabs mt-[121px]'>
                    <TabPane key={'1'} tab="Edit Profile" />
                    <TabPane key={'2'} tab="See Activities">
                        <Activities />
                    </TabPane>
                    <TabPane key={'3'} tab="Settings">
                        <Settings />
                    </TabPane>
                    <TabPane key={'4'} tab="Rental Shop" >
                        <RentalShop />
                    </TabPane>
                    <TabPane key={'5'} tab="Review">
                        <Review />
                    </TabPane>
                </Tabs>
                <div className="py-10 flex justify-center items-center">
                    <Image 
                        src={'/images/favorite.png'}
                        alt="Profile Image"
                        width={297}
                        height={365}
                        />
                </div>
            </section>
        </main>
        <Footer />
    </div>
) 

};

export default Profile;