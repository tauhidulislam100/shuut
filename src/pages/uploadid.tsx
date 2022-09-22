import React from 'react';
import { Footer, IdForm, NavBar, TakePhoto, UploadId, UploadPassport } from '../components';
import { BsArrowLeftCircle } from 'react-icons/bs';


const Verify = () => {

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
            {/* <UploadId /> */}
            {/* <IdForm /> */}
            {/* <TakePhoto /> */}
            <UploadPassport />
        </main>
        <Footer />
    </div>
) 

};

export default Verify;