import React from 'react'
import { Footer, NavBar } from '../../components';

const HowItWorks = () => {
    return (
        <>
            <header>
                <div className='container'>
                    <NavBar />
                    <div className="grid grid-cols-2 gap-10 items-center">
                        <div>
                            <h2 className='text-primary text-[60px] font-semibold leading-[60px] max-w-[404px] title-with-line'>How To Rent On SHUUT</h2>
                            <p className='text-2xl text-body opacity-80 max-w-[444px]'>Access items without owning them by renting them from people in your neighbourhood in a few easy steps.</p>
                        </div>
                        <img className='max-w-full object-cover' src='/images/illustration-1.png' alt='illustration' />
                    </div>
                </div>
            </header>
            <Footer />
        </>
    )
}

export default HowItWorks;