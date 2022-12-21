import React from "react";
import { Footer, NavBar } from "../../components";
import Image from "next/image";
import { hiwBeforeRental, hiwDuringRental, listItemCat } from "../../data";
import { NextPage } from "next";
import Link from "next/link";
import { GetCategoryWithImages } from "../../graphql/query_mutations";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Spin } from "antd";

const HowItWorks: NextPage = () => {
  const router = useRouter();
  const { loading, data } = useQuery(GetCategoryWithImages, {
    fetchPolicy: "cache-and-network",
  });

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
      <header>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="mt-10 text-primary text-5xl md:text-[60px] font-semibold leading-[60px] max-w-[404px]">
                How To Rent On{" "}
                <span className="title-with-line pb-1">SHUUT</span>
              </h2>
              <p className="mt-12 text-2xl text-body opacity-80 max-w-[444px]">
                Access items without owning them by renting them from people in
                your neighbourhood in a few easy steps.
              </p>
            </div>
            <div className="relative -mb-1.5">
              <Image
                className="object-cover -z-10"
                width={642}
                height={670}
                src="/images/illustration-1.png"
                alt="illustration"
              />
            </div>
          </div>
        </div>
      </header>
      <section className="bg-gradient-radial from-secondary to-primary">
        <div className="container py-[70px] text-white">
          <h2 className="text-lg font-medium text-inherit">Try SHUUT</h2>
          <h1 className="mt-2.5 text-[32px] font-semibold text-inherit">
            Before The Rentals
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
            <Link href={"/listings/search"}>
              <a className="transition-all duration-200 bg-white hover:bg-secondary  h-[48px] w-[193px] text-secondary hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                Browse Item
              </a>
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-[#F8F8F8]">
        <div className="container pt-28 text-primary">
          <h2 className="text-lg font-medium text-inherit">Try SHUUT</h2>
          <h1 className="mt-2.5 text-[32px] font-semibold text-inherit">
            During The Rentals
          </h1>
          <div className="mt-10 space-y-10 md:space-y-0 md:flex justify-center gap-10 max-w-[766px] mx-auto">
            {hiwDuringRental.map((itm, idx) => (
              <div
                key={`during_rental_${idx}`}
                className="bg-[#FAFCFF] rounded-[10px] border border-[#D0CFD8] px-10 py-14"
              >
                <div className="text-center">
                  <div className="relative">
                    <Image
                      src={itm.icon}
                      alt={"Icon"}
                      width={100}
                      height={100}
                      className="object-cover rounded-full bg-body"
                    />
                  </div>
                  <h1 className="text-primary my-[30px] text-lg font-semibold font-sofia-pro">
                    {itm.title}
                  </h1>
                  <p className="font-sofia-pro text-body">{itm.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center py-12">
            <Link href={"/listings/search"}>
              <a className=" bg-secondary hover:bg-primary h-[48px] w-[193px]  !text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                Find Item
              </a>
            </Link>
          </div>
        </div>
      </section>
      <div className="pb-20">
        <div className="container md:flex flex-row-reverse justify-between items-center mt-[121px] mb-5">
          <div className="">
            <div className="relative">
              <Image
                src={"/images/moneyverse.png"}
                alt={"Illustration"}
                width={399}
                height={350}
                className="bg-bottom object-cover"
              />
            </div>
          </div>
          <div className="">
            <div className="max-w-[498px] font-lota">
              <h1 className="font-semibold text-[32px] text-[#1B1C20]">
                Want To Make Some Money
              </h1>
              <p className="mt-5 text-lg text-body">
                Message and rent at the tap of a button. The Fat Llama app is
                the easiest way to find what you need, manage your rentals and
                purchases and get instant updates. Get it now on iOS and
                Android.
              </p>
              <div className="flex justify-center md:justify-start mt-12">
                <button className=" bg-secondary hover:bg-primary h-[48px] w-[193px]  !text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#F8F8F8]">
        <div className="container py-[70px]">
          <div className="">
            <h1 className="text-[32px] font-semibold text-primary">
              Categories
            </h1>
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
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HowItWorks;
