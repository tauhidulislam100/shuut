import React, { useState } from 'react';
import { Footer, IdForm, NavBar, TakePhoto, UploadId, UploadPassport } from '../components';
import { BsArrowLeftCircle } from 'react-icons/bs';


const Verify = () => {

    const [stage, setStage] = useState(0);

    const nextHandler = () => {
        if(stage >= 3) return setStage(0);
        setStage(prevState => prevState + 1);
    };

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
            {
                stage === 1 ? <IdForm handleNext={nextHandler} />:
                stage === 2 ? <TakePhoto handleNext={nextHandler} />:
                stage === 3 ? <UploadPassport handleNext={nextHandler} />:
                <UploadId handleNext={nextHandler} />
            }
        </main>
        <Footer />
    </div>
) 

};

export default Verify;