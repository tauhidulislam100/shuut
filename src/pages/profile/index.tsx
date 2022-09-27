import React from 'react';
import { 
    Footer, NavBar, Review, 
    Activities, RentalShop,
    Settings, EditProfile } from '../../components';
import { BsArrowLeftCircle } from 'react-icons/bs';
import Image from 'next/image';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const Profile = () => {

return (
    <div className="">
        <div className="container">
            <NavBar />
        </div>
        <div className="border-b"></div>
        <main className="container mt-5">
            <div className="">
                <button className='text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center'>
                    <span className='mr-2 text-secondary'><BsArrowLeftCircle /></span>
                    back
                </button>
            </div>
            <section className="px-40 mt-10">
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
                    <TabPane key={'1'} tab="Edit Profile">
                        <EditProfile />
                    </TabPane>
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
            </section>
        </main>
        <Footer />
    </div>
) 

};

export default Profile;