import { Carousel, Collapse } from 'antd';
import type { NextPage } from 'next';
import { IoIosSearch } from 'react-icons/io';
import { BsArrowLeft, BsArrowRight, BsPlus, BsX } from 'react-icons/bs';
import { Footer, NavBar, RattingBar } from '../components';
import { useRef } from 'react';
import { CarouselRef } from 'antd/lib/carousel';
import Image from 'next/image';


// convert this array into a list of objects key will be image and title 
const gears = [
  {
    image: 'camera-gear-1.png',
    name: 'Cameras',
  },
  {
    image: 'drone-gear-1.png',
    name: 'Drones',
  },
  {
    image: 'lighting-gear-1.png',
    name: 'Lightings',
  },
  {
    image: 'accessories-1.png',
    name: 'Cameras Accesories',
  },
  {
    image: 'tripod-support-1.png',
    name: 'Tripod Support',
  },
  {
    image: 'electronics-1.png',
    name: 'Electricals',
  },
  {
    image: 'audio-1.png',
    name: 'Audio',
  },
  {
    image: 'vr-1.png',
    name: 'VR (oculus)',
  },
];

const slideItems = [
  {
    name: 'Floyd Miles',
    comment: `Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. 
    Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat `,
    review: 3,
  },
  {
    name: 'Ronald Richards',
    comment: `ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.`,
    review: 3.5,
  },
  {
    name: 'Savannah Nguyen',
    comment: `Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. 
    Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.`,
    review: 3.5,
  },
  {
    name: 'Savannah Nguyen',
    comment: `Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. 
    Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.`,
    review: 4,
  },
  {
    name: 'Savannah Nguyen',
    comment: `Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. 
    Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.`,
    review: 4.5,
  },
  {
    name: 'Savannah Nguyen',
    comment: `Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. 
    Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.`,
    review: 5,
  },
  {
    name: 'Savannah Nguyen',
    comment: `Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. 
    Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.`,
    review: 3.2,
  },
];



const Home: NextPage = () => {
  const carosuselRef = useRef<CarouselRef>(null);

  const next = () => {
    carosuselRef.current?.next();
  };

  const prev = () => {
    carosuselRef.current?.prev();
  };

  return (
    <>
      <NavBar />
      <div className='container'>
        <section className="flex flex-col-reverse lg:flex-row gap-5 md:gap-10 pt-20">
          <div>
            <h2 className='text-4xl leading-[40px] md:text-[50px] md:leading-[60px] font-semibold text-primary lg:max-w-[509px]'>
              Rentals, For Camera Gears
            </h2>
            <p className='text-lg md:text-2xl text-body font-normal text-opacity-80 mt-7 mb-8 max-w-[469px]'>
              The easiest way to rent camera gear, rent from local trusted creatives in your community.
            </p>

            <div className="flex items-center w-[430px] max-w-full border border-body-light rounded-lg p-[2px] relative">
              <input placeholder='All Gears' className='min-w-max px-10 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light' />
              <button className='px-7 h-12 bg-secondary text-white min-w-max rounded-r-lg'>
                Search
              </button>
              <span className='absolute top-4 left-4 text-lg text-[#263238]'>
                <IoIosSearch />
              </span>
            </div>
            <p className='mt-16 text-[#6C6C6C] text-base font-normal'>In Partnership With</p>
            <div className="flex items-center gap-6 mt-4">
              <img src='/images/logos/leadway.png' className='max-w-full object-cover w-[82px] h-[32px]' />
              <img src='/images/logos/people.png' className='max-w-full object-cover w-[111px] h-[35px]' />
              <img src='/images/logos/wapic.png' className='max-w-full object-cover w-[94px] h-[29px]' />
              <img src='/images/logos/axamansard.png' className='max-w-full object-cover w-[118px] h-[21px]' />
            </div>
          </div>
          <div className='w-full h-full lg:ml-10'>
            <Image 
              src='/images/camera-big-with-bg.png' 
              alt='Home bg image' 
              className='object-cover max-w-full'
              width={822}
              height={590} />
          </div>
        </section>
        <section className='py-16'>
          <h3 className='text-[32px] text-secondary font-semibold tracking-tighter mb-8'>SHUUT Offers</h3>
          <div className="sm:pl-8 space-y-5 sm:space-y-0 sm:grid sm:grid-cols-2 grid-cols-3 gap-4">
            <div className="border border-[#DFDFDF] rounded-[10px] p-7">
              <h3 className='text-2xl text-primary-100 font-semibold mb-7 mt-5'>Access To More</h3>
              <p className='text-base font-normal text-primary-100'>
                Is be upon sang fond must shew. Really boy law county she unable her sister. Feet you off its like like six.
              </p>
            </div>
            <div className="border border-[#DFDFDF] rounded-[10px] p-7">
              <h3 className='text-2xl text-primary-100 font-semibold mb-7 mt-5'>Save Money</h3>
              <p className='text-base font-normal text-primary-100'>
                Is be upon sang fond must shew. Really boy law county she unable her sister. Feet you off its like like six.
              </p>
            </div>
            <div className="border border-[#DFDFDF] rounded-[10px] p-7">
              <h3 className='text-2xl text-primary-100 font-semibold mb-7 mt-5'>Get Insured</h3>
              <p className='text-base font-normal text-primary-100'>
                Is be upon sang fond must shew. Really boy law county she unable her sister. Feet you off its like like six.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className='py-20 bg-[#F8F8F8]'>
        <div className="container">
          <h3 className='text-[32px] text-secondary font-semibold tracking-tighter mb-8'>
            Explore Gears
          </h3>

          <div className="space-y-8 sm:space-y-0 sm:grid sm:grid-cols-2 grid-cols-4 gap-4 mt-12 md:pl-4 gap-y-8 pb-16">
            {gears.map(gear => (
              <div className="bg-white rounded-[5px] p-4" key={gear.name}>
                <img src={`/images/gears/${gear.image}`} className='object-cover hover:scale-105 w-full rounded-[5px] h-[219px] transition-all' />
                <p className='mt-4 text-[15px] text-primary-100 font-medium'>{gear.name}</p>
              </div>
            ))}
          </div>

          <div className='pt-16 pl-4 md:grid grid-cols-2 2xl:gap-x-40 items-center'>
            <div className="relative w-full h-[537px]">
              <Image 
                src='/images/mockup.png' 
                className='object-contain lg:object-cover left-0 max-w-full'
                alt='Mobile App'
                layout='fill' />
            </div>
            <div>
              <h2 className='text-[32px] font-semibold text-primary-200'>Stay Updated On Our Mobile App</h2>
              <p className='text-body max-w-[498px] text-lg mt-4 mb-7'>
                Message and rent at the tap of a button. The Fat Llama app is the easiest way to find what you need, manage your rentals and purchases and get instant updates. Get it now on iOS and Android.
              </p>
              <div className="flex items-center gap-10">
                <a href="#"><img src="/images/logos/appstore.png" className='max-w-full object-cover' /></a>
                <a href="#"><img src="/images/logos/google-play.png" className='max-w-full object-cover' /></a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-10">
        <div className="container">
          <div className="md:flex items-start">
            <h3 className='text-[32px] text-secondary font-semibold tracking-tighter md:w-[20%]'>
              FAQ
            </h3>
            <div className='md:w-[80%]'>
              <Collapse className='w-full bg-white faq-collapse' bordered={false} expandIconPosition='end' expandIcon={(p) =>
                p.isActive ? <span><BsX /></span> : <span><BsPlus /></span>
              }>
                <Collapse.Panel key={'1'} header='How secured is my Equipment?'>
                  <p>
                    We are currently in the process of identifying interested founding members. When at least 100 have made a verbal commitment, the process of negotiating with potential partner nations can begin. There is no financial obligation until the founding members have approved a negotiated deal.
                  </p>
                </Collapse.Panel>
                <Collapse.Panel key={'2'} header='Do renter pay for equipment transportation?'>
                  <p>
                    We are currently in the process of identifying interested founding members. When at least 100 have made a verbal commitment, the process of negotiating with potential partner nations can begin. There is no financial obligation until the founding members have approved a negotiated deal.
                  </p>
                </Collapse.Panel>
                <Collapse.Panel key={'3'} header='How much money is needed for insurance ?'>
                  <p>
                    We are currently in the process of identifying interested founding members. When at least 100 have made a verbal commitment, the process of negotiating with potential partner nations can begin. There is no financial obligation until the founding members have approved a negotiated deal.
                  </p>
                </Collapse.Panel>
                <Collapse.Panel key={'4'} header='What services are available on SHUUT?  '>
                  <p>
                    We are currently in the process of identifying interested founding members. When at least 100 have made a verbal commitment, the process of negotiating with potential partner nations can begin. There is no financial obligation until the founding members have approved a negotiated deal.
                  </p>
                </Collapse.Panel>
              </Collapse>
            </div>
          </div>
        </div>
      </section>

      <section className='py-16'>
        <div className="container">
          <h3 className='text-[32px] text-secondary font-semibold tracking-tighter'>
            Our Customers Feedback
          </h3>
          <div className="flex items-center justify-end gap-4 my-8">
            <button onClick={prev} className='w-[32px] h-[32px] rounded-full inline-grid place-items-center bg-[#F8F8F8] text-[#453232] hover:bg-secondary hover:text-white text-base'>
              <BsArrowLeft />
            </button>
            <button onClick={next} className='w-[32px] h-[32px] rounded-full inline-grid place-items-center bg-[#F8F8F8] text-[#453232] hover:bg-secondary hover:text-white text-base'>
              <BsArrowRight />
            </button>
          </div>
        </div>
        <div className="2xl:ml-[204px] xl:ml-[100px]">
          <Carousel className='home-carousel min-h-[267px]' ref={carosuselRef} slidesToShow={1.2} infinite={false} arrows={false} dots={false} centerMode={false}>
            {slideItems.map((slideItem, i) => (
              <div className='border border-[#E7EAEC] p-5 rounded-[5px] min-h-full' key={i}>
                <div className="flex items-start justify-between">
                  <img src="/images/dummy.png" className='max-w-full object-cover w-[54px] h-[54px] rounded-[5px]' />
                  <RattingBar ratting={slideItem.review} />
                </div>
                <h3 className='text-xl text-[#1F1F1F] ml-2 my-4'>{slideItem.name}</h3>
                <p className='text-[#133240] text-sm'>
                  {slideItem.comment}
                </p>
              </div>
            ))}
          </Carousel>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Home;
