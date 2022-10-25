import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import useAsyncEffect from "use-async-effect";
import { Footer, NavBar, SingleProduct } from "../../../components";
import {
  hiwBeforeRental,
  listItemCat,
  topCities,
  tripodInLagos,
} from "../../../data";
import {
  GetCategoryWithImages,
  GetListingByCategory,
} from "../../../graphql/query_mutations";
import { defaultRadius } from "../search";

const Category = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>();
  const [getListingByCategory, { data, loading, client }] =
    useLazyQuery(GetListingByCategory);
  // const cachedCategories = client.readQuery({
  //   query: GetCategoryWithImages,
  // });

  useAsyncEffect(
    async (isMounted) => {
      if (router?.query?.name && isMounted()) {
        await getListingByCategory({
          variables: {
            name: `%${router.query.name}%`,
            lat: topCities[0].lat,
            lng: topCities[0].lng,
            distance: defaultRadius,
          },
        });
      }
    },
    [router]
  );

  const handleSearch = () => {
    router.push({
      pathname: "/listings/search",
      query: { query: searchText },
    });
  };

  return (
    <>
      <div className="container">
        <NavBar />
        <section className="md:flex flex-row-reverse justify-between gap-10 md:pt-20">
          <div>
            <img
              src={"/images/tripod.png"}
              alt={router.query?.name as string}
              className="object-cover max-w-full"
            />
          </div>
          <div className="mt-10">
            <h2 className="text-[50px] leading-[60px] font-semibold text-primary max-w-[509px]">
              Rentals, For Camera Gears
            </h2>
            <p className="text-2xl text-body font-normal text-opacity-80 mt-7 mb-8 max-w-[469px]">
              The easiest way to rent camera gear, rent from local trusted
              creatives in your community.
            </p>

            {/* <div className="flex items-center w-[430px] max-w-full border border-body-light rounded-lg p-[2px] relative">
              <input
                placeholder="All Gears"
                className="sm:min-w-max px-10 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light"
              />
              <button className="px-7 h-12 bg-secondary text-white min-w-max rounded-r-lg">
                Find Gear
              </button>
              <span className="absolute top-4 left-4 text-lg text-[#263238]">
                <IoIosSearch />
              </span>
            </div> */}

            <div className="flex items-center w-[430px] max-w-full border border-body-light rounded-lg p-[2px] relative">
              <input
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="All Gears"
                className="min-w-max px-10 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light"
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
            <p className="mt-16 text-[#6C6C6C] text-base font-normal">
              In Partnership With
            </p>
            <div className="flex items-center gap-6 mt-4">
              <img
                alt="axa mansard"
                src="/images/logos/axamansard.png"
                className="max-w-full object-cover w-[118px] h-[21px]"
              />
              {/* <img
                src="/images/logos/leadway.png"
                className="max-w-full object-cover w-[82px] h-[32px]"
              />
              <img
                src="/images/logos/people.png"
                className="max-w-full object-cover w-[111px] h-[35px]"
              />
              <img
                src="/images/logos/wapic.png"
                className="max-w-full object-cover w-[94px] h-[29px]"
              /> */}
            </div>
          </div>
        </section>
      </div>
      <section className="bg-[#F8F8F8]">
        <div className="container py-16">
          <h1 className="text-[32px] text-secondary font-semibold font-lota">
            {router.query?.name} In Lagos
          </h1>
          {loading ? (
            <Spin size="large" />
          ) : (
            <div className="mt-5 sm:mt-8 sm:pl-2 space-y-10 sm:space-y-0 sm:grid grid-cols-3 lg:grid-cols-5 gap-5">
              {data?.listing?.map((listing: Record<string, any>) => (
                <SingleProduct
                  key={`lagos_${listing?.id}`}
                  data={listing as any}
                />
              ))}
            </div>
          )}
          <div className="flex justify-center mt-12">
            <Link href={`/listings/search?query=${router.query?.name}`}>
              <button className=" bg-secondary hover:bg-primary px-10 h-[48px] min-w-[193px]  !text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                Browse {router.query?.name} Tn Lagos
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#FFFFFF]">
        <div className="container py-[70px]">
          <div className="py-16">
            <h3 className="text-[32px] text-secondary font-semibold tracking-tighter mb-8">
              SHUUT Offers
            </h3>
            <div className="sm:pl-8 space-y-8 md:space-y-0 md:grid grid-cols-3 gap-4">
              <div className="border border-[#DFDFDF] rounded-[10px] p-7">
                <h3 className="text-2xl text-primary-100 font-semibold mb-7 mt-5">
                  Access To More
                </h3>
                <p className="text-base font-normal text-primary-100">
                  Is be upon sang fond must shew. Really boy law county she
                  unable her sister. Feet you off its like like six.
                </p>
              </div>
              <div className="border border-[#DFDFDF] rounded-[10px] p-7">
                <h3 className="text-2xl text-primary-100 font-semibold mb-7 mt-5">
                  Save Money
                </h3>
                <p className="text-base font-normal text-primary-100">
                  Is be upon sang fond must shew. Really boy law county she
                  unable her sister. Feet you off its like like six.
                </p>
              </div>
              <div className="border border-[#DFDFDF] rounded-[10px] p-7">
                <h3 className="text-2xl text-primary-100 font-semibold mb-7 mt-5">
                  Get Insured
                </h3>
                <p className="text-base font-normal text-primary-100">
                  Is be upon sang fond must shew. Really boy law county she
                  unable her sister. Feet you off its like like six.
                </p>
              </div>
            </div>
          </div>
          {/* <h1 className="text-[32px] font-semibold text-primary">Categories</h1>
                    <div className="grid grid-cols-4 gap-5 mt-[30px]">
                        {
                            listItemCat.map((cat, idx) => (
                                <div key={`cat_${idx}`} className="bg-white rounded-md">
                                    <div className="px-4 pt-3">
                                        <div className="relative w-full rounded-[5px] overflow-hidden h-[220px]">
                                            <Image src={cat.cat_img} alt="Cat Img" className="object-cover hover:scale-105 w-full h-[219px] transition-all duration-300" layout="fill" />
                                        </div>
                                        <h3 className="my-3.5 text-primary-100 text-sm font-medium">{cat.title}</h3>
                                    </div>
                                </div>
                            ))
                        }
                    </div> */}
        </div>
      </section>
      <section className="bg-gradient-radial from-secondary to-primary">
        <div className="container py-[70px] text-white">
          <h2 className="text-lg font-medium text-inherit">Try SHUUT</h2>
          <h1 className="mt-2.5 text-[32px] font-semibold text-inherit">
            How Rentals Works
          </h1>
          <div className="mt-10 grid md:grid-cols-3 gap-10 md:gap-6">
            {hiwBeforeRental.map((itm, idx) => (
              <div key={`before_rental_${idx}`} className="flex gap-5">
                <div className="relative  w-[60px] min-w-[60px] h-[60px] rounded-full bg-white flex justify-center items-center">
                  <Image
                    src={itm.icon}
                    alt="Icon"
                    width={40}
                    height={40}
                    className="bg-center"
                  />
                </div>
                <div className="">
                  <h1 className="text-lg text-inherit font-sofia-pro font-semibold">
                    {itm.title}
                  </h1>
                  <p className="text-sm font-sofia-pro">{itm.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-[60px]">
            <button className="transition-all duration-200 bg-white hover:bg-secondary  h-[48px] w-[193px] text-secondary hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
              List An Item
            </button>
          </div>
        </div>
      </section>
      <section className="bg-[#FFFFFF]">
        <div className="container py-[70px]">
          <div className="pt-16 pl-4 grid md:grid-cols-2 2xl:gap-x-40 items-center">
            <img
              src="/images/mockup.png"
              className="object-cover max-w-full h-[537px]"
            />
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
                  />
                </a>
                <a href="#">
                  <img
                    src="/images/logos/google-play.png"
                    className="max-w-full object-cover"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gradient-radial from-secondary to-primary">
        <div className="container py-[60px] text-white">
          <h1 className="font-lota font-semibold text-[32px] text-center text-white">
            Find More In Lagos
          </h1>
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {Array(30)
              .fill("Tripod Air")
              .map((_, idx) => (
                <p
                  key={`lagos_${idx}`}
                  className="text-lg font-lota font-semibold"
                >
                  {_}
                </p>
              ))}
          </div>
          <h1 className="mt-[60px] font-lota font-semibold text-[32px] text-center text-white">
            Browse On Other Cities
          </h1>
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {Array(30)
              .fill("")
              .map((_, idx) => (
                <p
                  key={`lagos_${idx}`}
                  className="text-lg font-lota font-semibold"
                >
                  Kaduna
                </p>
              ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Category;
