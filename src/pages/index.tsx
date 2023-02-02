import { Carousel, Collapse, Spin } from "antd";
import type { NextPage } from "next";
import { IoIosSearch } from "react-icons/io";
import { BsArrowLeft, BsArrowRight, BsPlus, BsX } from "react-icons/bs";
import { Footer, NavBar, RattingBar } from "../components";
import { useRef, useState } from "react";
import { CarouselRef } from "antd/lib/carousel";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GetCategoryWithImages } from "../graphql/query_mutations";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

const Home: NextPage = () => {
  const router = useRouter();
  const { loading, data } = useQuery(GetCategoryWithImages, {
    fetchPolicy: "cache-and-network",
  });
  const carosuselRef = useRef<CarouselRef>(null);
  const [searchText, setSearchText] = useState<string>();

  function next() {
    carosuselRef.current?.next();
  }

  const prev = () => {
    carosuselRef.current?.prev();
  };

  const handleSearch = () => {
    router.push({
      pathname: "/listings/search",
      query: { query: searchText },
    });
  };

  const goToCategory = (slug: string, name: string) => {
    router.push({
      pathname: `/listings/category/${slug}`,
      query: {
        name,
      },
    });
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <section className="flex flex-col lg:flex-row gap-5 md:gap-10 pt-20">
          <div className="mdMax:flex mdMax:flex-col mdMax:items-center">
            <h2 className="text-4xl mdMax:text-center leading-[40px] md:text-[50px] md:leading-[60px] font-semibold text-primary max-w-[580px]">
              Rent on the go whatever, whenever and wherever.
            </h2>
            <p className="text-lg mdMax:text-center md:text-2xl text-body font-normal text-opacity-80 mt-7 mb-8 max-w-[545px]">
              Find and hire all your creative project&apos;s needs from people
              in your community.
            </p>

            <div className="flex items-center md:w-[430px] w-full max-w-full border border-body-light rounded-lg p-[2px] relative">
              <input
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="All Gears"
                className="sm:min-w-max px-10 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light"
              />
              <button
                onClick={handleSearch}
                className="px-7 h-12 bg-secondary text-white min-w-max rounded-r-lg"
              >
                Search
              </button>
              <span className="absolute top-4 left-4 text-lg text-[#263238]">
                <IoIosSearch />
              </span>
            </div>
            <p className="lg:mt-16 mt-4 text-[#6C6C6C] text-base font-normal">
              In Partnership With
            </p>
            <div className="flex items-center gap-6 mt-4">
              <img
                alt="axa mansard"
                src="/images/logos/axamansard.png"
                className="max-w-full object-cover w-[118px] h-[21px]"
              />
            </div>
          </div>
          <div className="lg:w-[calc(100%-580px)] w-full h-full flex lg:justify-end justify-center">
            <img
              src="/images/camera-big-with-bg.png"
              alt="Home bg image"
              className="object-cover max-w-[720px] w-full"
            />
          </div>
        </section>
        <section className="py-16">
          <h3 className="text-[32px] text-secondary font-semibold tracking-tighter mb-8">
            SHUUT Offers
          </h3>
          <div className="sm:pl-8 space-y-5 sm:space-y-0 sm:grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="border border-[#DFDFDF] rounded-[10px] p-7">
              <h3 className="text-2xl text-primary-100 font-semibold mb-7 mt-5">
                Access To More
              </h3>
              <p className="text-base font-normal text-primary-100">
                Get access to a wide range of products to pursue your goals.
                More products, more possibilities
              </p>
            </div>
            <div className="border border-[#DFDFDF] rounded-[10px] p-7">
              <h3 className="text-2xl text-primary-100 font-semibold mb-7 mt-5">
                Save Money
              </h3>
              <p className="text-base font-normal text-primary-100">
                Renting world-class gadgets saves you money you, than buying.
                Spend less, achieve more
              </p>
            </div>
            <div className="border border-[#DFDFDF] rounded-[10px] p-7">
              <h3 className="text-2xl text-primary-100 font-semibold mb-7 mt-5">
                Get Insured
              </h3>
              <p className="text-base font-normal text-primary-100">
                Insurance gives security to gadgets. Your insurance, your
                security.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="pt-20 sm:pb-0 pb-20 bg-[#F8F8F8]">
        <div className="container">
          <h3 className="text-[32px] text-secondary font-semibold tracking-tighter mb-8">
            Explore Gears
          </h3>
          {loading ? (
            <Spin size="large" />
          ) : (
            <div className="space-y-8 sm:space-y-0 sm:grid grid-cols-2 lg:grid-cols-4 sm:grid-cols-3 gap-4 mt-12 md:pl-4 gap-y-8 pb-16">
              {data?.category?.map((category: Record<string, any>) => (
                <div
                  onClick={() => goToCategory(category.slug, category.name)}
                  className="bg-white rounded-[5px] p-4 cursor-pointer"
                  key={category.slug}
                >
                  <img
                    alt="category logo"
                    src={category.image}
                    className="object-cover hover:scale-105 w-full rounded-[5px] h-[219px] transition-all"
                  />
                  <p className="mt-4 text-[15px] text-primary-100 font-medium">
                    {category.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="pt-16 pl-4 md:grid grid-cols-2 2xl:gap-x-40 items-center">
            <div className="relative w-full">
              <img
                src="/images/mockup.png"
                alt="Mobile App"
                className="object-cover max-w-full w-full"
              />
            </div>
            <div>
              <h2 className="text-[32px] font-semibold text-primary-200">
                Stay Updated On Our Mobile App
              </h2>
              <p className="text-body max-w-[498px] text-lg mt-4 mb-7">
                Message and rent at the tap of a button. The Fat Llama app is
                the easiest way to find what you need, manage your rentals and
                purchases and get instant updates. Get it now on iOS and
                Android.
              </p>
              <div className="flex items-center gap-10">
                <a href="#">
                  <img
                    src="/images/logos/appstore.png"
                    className="max-w-full object-cover"
                    alt="app store"
                  />
                </a>
                <a href="#">
                  <img
                    src="/images/logos/google-play.png"
                    className="max-w-full object-cover"
                    alt="playstore"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-10">
        <div className="container">
          <div className="md:flex items-start">
            <h3 className="text-[32px] text-secondary font-semibold tracking-tighter md:w-[20%]">
              FAQ
            </h3>
            <div className="md:w-[80%]">
              <Collapse
                className="faq-collapse !font-lota !font-semibold !text-sm xs:text-base sm:text-2xl"
                bordered={false}
                expandIconPosition="end"
                expandIcon={(p) =>
                  p.isActive ? (
                    <span>
                      <BsX />
                    </span>
                  ) : (
                    <span>
                      <BsPlus />
                    </span>
                  )
                }
              >
                <Collapse.Panel key={"1"} header="How secured is my Equipment?">
                  <p className="font-normal text-sm sm:text-xl">
                    We are currently in the process of identifying interested
                    founding members. When at least 100 have made a verbal
                    commitment, the process of negotiating with potential
                    partner nations can begin. There is no financial obligation
                    until the founding members have approved a negotiated deal.
                  </p>
                </Collapse.Panel>
                <Collapse.Panel
                  key={"2"}
                  header="Do renter pay for equipment transportation?"
                >
                  <p className="font-normal text-sm sm:text-xl">
                    We are currently in the process of identifying interested
                    founding members. When at least 100 have made a verbal
                    commitment, the process of negotiating with potential
                    partner nations can begin. There is no financial obligation
                    until the founding members have approved a negotiated deal.
                  </p>
                </Collapse.Panel>
                <Collapse.Panel
                  key={"3"}
                  header="How much money is needed for insurance ?"
                >
                  <p className="font-normal text-sm sm:text-xl">
                    We are currently in the process of identifying interested
                    founding members. When at least 100 have made a verbal
                    commitment, the process of negotiating with potential
                    partner nations can begin. There is no financial obligation
                    until the founding members have approved a negotiated deal.
                  </p>
                </Collapse.Panel>
                <Collapse.Panel
                  key={"4"}
                  header="What services are available on SHUUT?  "
                >
                  <p className="font-normal text-sm sm:text-xl">
                    We are currently in the process of identifying interested
                    founding members. When at least 100 have made a verbal
                    commitment, the process of negotiating with potential
                    partner nations can begin. There is no financial obligation
                    until the founding members have approved a negotiated deal.
                  </p>
                </Collapse.Panel>
              </Collapse>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-16">
        <div className="container">
          <h3 className="text-[32px] text-secondary font-semibold tracking-tighter">
            Our Customers Feedback
          </h3>
          <div className="flex items-center justify-end gap-4 my-8">
            <button
              onClick={prev}
              className="w-[32px] h-[32px] rounded-full inline-grid place-items-center bg-[#F8F8F8] text-[#453232] hover:bg-secondary hover:text-white text-base"
            >
              <BsArrowLeft />
            </button>
            <button
              onClick={next}
              className="w-[32px] h-[32px] rounded-full inline-grid place-items-center bg-[#F8F8F8] text-[#453232] hover:bg-secondary hover:text-white text-base"
            >
              <BsArrowRight />
            </button>
          </div>
        </div>
        <div className="2xl:ml-[204px] xl:ml-[100px]">
          <Carousel
            className="home-carousel min-h-[267px]"
            ref={carosuselRef}
            slidesToShow={isDesktop ? 3.2 : isTablet ? 2.2 : 1}
            infinite={false}
            arrows={false}
            dots={false}
            centerMode={false}
          >
            {slideItems.map((slideItem, i) => (
              <div
                className="border border-[#E7EAEC] p-5 rounded-[5px] min-h-full"
                key={i}
              >
                <div className="flex items-start justify-between">
                  <img
                    src="/images/dummy.png"
                    className="max-w-full object-cover w-[54px] h-[54px] rounded-[5px]"
                  />
                  <RattingBar ratting={slideItem.review} />
                </div>
                <h3 className="text-xl text-[#1F1F1F] ml-2 my-4">
                  {slideItem.name}
                </h3>
                <p className="text-[#133240] text-sm">{slideItem.comment}</p>
              </div>
            ))}
          </Carousel>
        </div>
      </section> */}
      <Footer />
    </>
  );
};

export default Home;
