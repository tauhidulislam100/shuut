import React, { useState } from 'react';
import { Footer, GeneralInfo, Insurance, Location, NavBar } from '../../components';
import { BsArrowLeftCircle } from 'react-icons/bs';

const NewListing = () => {

    const [step, setStep] = useState<string>('info');
    
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
            <div className="px-[10%]">
                <h1 className="mt-[74px] text-[32px] font-lota font-semibold text-primary">New Listings</h1>
                {
                    step === 'info' ? <GeneralInfo setStep={setStep} /> :
                    step === 'location' ? <Location setStep={setStep} />: <Insurance setStep={setStep} />
                }
            </div>
        </main>
        <Footer />
    </div>
) 

};

export default NewListing;