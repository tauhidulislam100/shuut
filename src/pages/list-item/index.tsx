import { BsArrowLeftCircle } from "react-icons/bs";
import { Footer, NavBar } from "../../components";
import Image from "next/image";
import { listItemCat, listItemGetstarted, listItemRenting } from "../../data";
import { NextPage } from "next";
import { Widget } from "@uploadcare/react-widget";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GetCategoryWithImages } from "../../graphql/query_mutations";
import { useRouter } from "next/router";
import { Spin } from "antd";
const ListItem: NextPage = () => {
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
    <div className="">
      <NavBar />
      <div className="container">
        <div className="">
          <button className="text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center">
            <span className="mr-2 text-secondary">
              <BsArrowLeftCircle />
            </span>
            back
          </button>
          <div className="2xl:px-24 md:flex items-end pt-20">
            <div className="lg:w-[450px] pb-20">
              <h1 className="text-[50px] font-semibold text-primary leading-[60px]">
                Start Earning On
                <span className="uppercase block">Shuut</span>
              </h1>
              <p className="text-2xl text-body lg:mt-12 mt-6">
                More than 1,000 listings available on shuut, and is the first
                place to renters comes for all camera equipments
              </p>
              <Link href={"/create-item"}>
                <a className="mt-7 bg-secondary hover:bg-primary h-[48px] w-[193px]  !text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                  List An Item
                </a>
              </Link>
            </div>

            <div className="relative h-full">
              <img
                src="/images/list-item/money.png"
                className="2xl:object-cover object-fit max-w-full lg:h-[450px] md:h-[350px] h-[280px]"
                alt="Cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:h-[411px] bg-gradient-radial from-secondary to-primary flex justify-center items-center py-4 lg:py-0">
        <div className="text-white text-center space-y-[30px] px-[10%]">
          <h1 className="text-[32px] font-semibold text-inherit">
            We’ve Got You Covered
          </h1>
          <p className="text-inherit text-2xl max-w-[953px] mx-auto">
            We take safety seriously, Every borrower in our marketplace gets
            verified by our team and should things go wrong, our item guarantee
            has your back.
          </p>
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-inherit">In Partnership With</h2>
            <div className="flex sm:gap-5 gap-x-3 mt-[30px]">
              {Array(5)
                .fill("")
                .map((v, idx) => (
                  <div key={idx} className="leadway">
                    <Image
                      src={"/images/list-item/leadway.png"}
                      alt="Logo"
                      width={82}
                      height={62}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#F8F8F8]">
        <div className="container py-[70px]">
          <div className="2xl:pl-24">
            <h1 className="text-[32px] font-semibold text-primary">
              Getting Started
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-[30px]">
              {listItemGetstarted.map((itm, idx) => (
                <div key={`get_${idx}`} className="p-6 bg-white rounded">
                  <div className="">
                    <h1 className="my-7 text-[#1F1F1F] text-2xl font-extrabold">
                      {itm.title}
                    </h1>
                    <p className="text-[#64607D]">{itm.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-[60px]">
              <Link href={"/create-item"}>
                <a className=" bg-secondary hover:bg-primary h-[48px] w-[193px]  !text-white hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                  List An Item
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#F8F8F8]">
        <div className="container py-[70px]">
          <div className="2xl:pl-24">
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
      <div className="bg-gradient-radial from-secondary to-primary">
        <div className="container py-[70px] text-white text-center">
          <h1 className="text-[32px] font-semibold text-inherit">
            How Renting Works
          </h1>
          <p className="mt-[30px] text-2xl">
            4 Easy steps to get going with rent on SHUUT.
          </p>
          <div className="grid lg:grid-cols-4 gap-4 sm:grid-cols-2 grid-cols-1 mt-[30px]">
            {listItemRenting.map((step, idx) => (
              <div key={`step_${idx}`} className="">
                <div className="">
                  <h1 className="text-[69px] font-extrabold text-inherit">
                    {idx + 1}
                  </h1>
                  <h3 className="text-lg font-semibold text-inherit mt-5 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[17px] font-light text-inherit">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-[60px]">
            <Link href={"/create-item"}>
              <a className=" bg-white hover:bg-secondary  h-[48px] w-[193px] text-secondary hover:text-white text-lg font-semibold inline-flex justify-center items-center rounded-lg">
                List An Item
              </a>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListItem;
