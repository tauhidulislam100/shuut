import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import useAsyncEffect from "use-async-effect";
import { Footer, NavBar, SingleProduct } from "../../../components";
import Button from "../../../components/UI/Button";
import { hiwBeforeRental, listItemCat, topCities } from "../../../data";
import { GetListingByCategory } from "../../../graphql/query_mutations";
import { defaultRadius } from "../search";

const Category = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>();
  const [getListingByCategory, { data, loading, client }] =
    useLazyQuery(GetListingByCategory);

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
      <NavBar />
      <div className="container">
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
              Ready . Rent . Roll
            </h2>
            <p className="text-2xl text-body font-normal text-opacity-80 mt-7 mb-8 max-w-[469px]">
              Hire tripods from other creatives in Lagos at attractive rates.
            </p>
            <div className="flex items-center xs:w-[430px] w-full max-w-full border border-body-light rounded-lg p-[2px] relative">
              <input
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="All Gears"
                className="min-w-max xs:px-10 px-8 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light"
              />
              <button
                onClick={handleSearch}
                className="xs:px-7 px-5 h-12 bg-secondary text-white min-w-max rounded-r-lg"
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
            </div>
          </div>
        </section>
      </div>
      <section className="bg-[#F8F8F8]">
        <div className="container py-16">
          <h1 className="text-[32px] text-secondary font-semibold font-lota">
            {router.query?.name}
          </h1>
          {loading ? (
            <Spin size="large" />
          ) : (
            <div className="mt-5 sm:mt-8 grid 2xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
              {data?.listing?.map((listing: Record<string, any>) => (
                <SingleProduct
                  key={`lagos_${listing?.id}`}
                  data={listing as any}
                />
              ))}
            </div>
          )}
          <div className="flex justify-center mt-12">
            <Link
              href={`/listings/search?category=${router.query?.name}&_location=true`}
            >
              <button className=" bg-secondary hover:bg-primary px-10 h-[48px] min-w-[193px]  !text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                Browse Item
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
                  Get access to a wide range of products to pursue your goals.
                  More products, more possibilities
                </p>
              </div>
              <div className="border border-[#DFDFDF] rounded-[10px] p-7">
                <h3 className="text-2xl text-primary-100 font-semibold mb-7 mt-5">
                  Save Money
                </h3>
                <p className="text-base font-normal text-primary-100">
                  Renting world-class gadgets saves you money, than buying.
                  spend less, achieve more
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
          </div>
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
            <Link href={"/list-item"}>
              <a className="transition-all duration-200 bg-white hover:bg-secondary  h-[48px] w-[193px] text-secondary hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                List An Item
              </a>
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-[#FFFFFF]">
        <div className="container py-[70px]">
          <div className="pt-16 pl-4 grid md:grid-cols-2 2xl:gap-x-40 items-start max-w-6xl mx-auto">
            <img
              src="/images/iphone_14_pro.png"
              className="object-cover max-w-full max-h-[666px] md:mb-0 mb-10"
              alt="app preview"
            />
            <div className="right-info">
              <h2 className="text-[32px] font-semibold text-primary-200 mb-5">
                Rent & List Insured Gears in 5 Minutes
              </h2>
              <div className="flex items-start mb-5 insured-item">
                <div className="font-lota font-medium text-secondary text-2xl relative left-line">
                  01
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-normal font-lota text-primary mb-2">
                    Create an account
                  </h2>
                  <p className="text-base font-lota font-light text-primary">
                    Get started by creating an account on shuut, to get access
                    to rental deals close to you.
                  </p>
                </div>
              </div>

              <div className="flex items-start my-12 insured-item">
                <div className="font-lota font-medium text-secondary text-2xl relative left-line">
                  02
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-normal font-lota text-primary mb-2">
                    Get Verified
                  </h2>
                  <p className="text-base font-lota font-light text-primary">
                    Get verified to prove authenticity.
                  </p>
                </div>
              </div>

              <div className="flex items-start insured-item  mt-16">
                <div className="font-lota font-medium text-secondary text-2xl relative left-line">
                  03
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-normal font-lota text-primary mb-2">
                    List & Rent Equipments
                  </h2>
                  <p className="text-base font-lota font-light text-primary">
                    List and rent all Items you need at attractive rates.
                  </p>
                </div>
              </div>
              <Link href={"/list-item"}>
                <a className="bg-secondary text-white font-semibold font-sofia-pro text-lg rounded-lg px-10 h-12 mt-24 inline-flex items-center hover:text-white">
                  Get Started
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gradient-radial from-secondary to-primary">
        <div className="container py-[60px] text-white">
          <h1 className="font-lota font-semibold text-[32px] text-center text-white">
            Find More In Lagos
          </h1>
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 md:place-content-stretch place-items-center">
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
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 md:place-content-stretch place-items-center">
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
