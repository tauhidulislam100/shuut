import React from "react";
import { NavBar } from "../../components";
import { BsArrowLeftCircle } from "react-icons/bs";
import Image from "next/image";
import { IoIosClose } from "react-icons/io";
import { Tabs } from "antd";
import { Niger } from "../../components/icons";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GetListingBySlug } from "../../graphql/query_mutations";
import AuthGuard from "../../components/auth-guard/AuthGuard";

const { TabPane } = Tabs;

const Listed = () => {
  const router = useRouter();
  const { data } = useQuery(GetListingBySlug, {
    variables: {
      slug: router.query.slug,
    },
  });

  console.log(data);
  return (
    <AuthGuard>
      <NavBar />
      <div className="border-b"></div>
      <main className="container">
        <div className="my-5">
          <button
            onClick={() => router.push("/list-item")}
            className="text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center"
          >
            <span className="mr-2 text-secondary">
              <BsArrowLeftCircle />
            </span>
            back
          </button>
        </div>
        <div className="mt-20 max-w-5xl mx-auto">
          <h1 className="font-lota text-[32px] font-semibold text-primary">
            Listed
          </h1>
          <div className="">
            <h3 className="mt-10 mb-8 font-lota text-lg text-primary-200">
              Photo
            </h3>
            <div className="w-full flex justify-center">
              <div className="relative px-2 py-1.5  border rounded-md">
                <img
                  src={data?.listing?.[0]?.images?.[0]?.url}
                  alt="Listed Image"
                  width={422}
                  height={256}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="bg-white rounded-md border p-4 mb-4 relative h-[285px]">
              <button className="absolute top-3 right-3 rounded-full w-6 h-6 inline-grid place-items-center border border-[#F4F4F4]">
                <IoIosClose />
              </button>
              <Tabs className="profile-tabs mt-4">
                <TabPane key="1" tab="Monthly Price">
                  <div className="flex items-center">
                    <p className="inline-flex items-center text-lg font-sofia-pro text-secondary">
                      <span>
                        <Niger />
                      </span>{" "}
                      {data?.listing?.[0].monthly_price}/week{" "}
                    </p>
                    <p className="text-lg font-sofia-pro text-secondary mx-2">
                      -
                    </p>
                    <p className="inline-flex items-center text-lg font-sofia-pro text-secondary">
                      <span>
                        <Niger />
                      </span>{" "}
                      {data?.listing?.[0].monthly_price}
                    </p>
                  </div>
                  <p className="text-sm my-5 text-primary-100 text-opacity-90">
                    We’ve analysed prices for {data?.listing?.[0].title} from
                    all renters on SHUUT.
                  </p>
                  <p className="text-sm text-primary-100 text-opacity-90">
                    The advert price is above average.
                  </p>
                </TabPane>
                <TabPane key="2" tab="Weekly Price">
                  <div className="flex items-center">
                    <p className="inline-flex items-center text-lg font-sofia-pro text-secondary">
                      <span>
                        <Niger />
                      </span>{" "}
                      {data?.listing?.[0].weekly_price}/week{" "}
                    </p>
                    <p className="text-lg font-sofia-pro text-secondary mx-2">
                      -
                    </p>
                    <p className="inline-flex items-center text-lg font-sofia-pro text-secondary">
                      <span>
                        <Niger />
                      </span>{" "}
                      {data?.listing?.[0].weekly_price}
                    </p>
                  </div>
                  <p className="text-sm my-5 text-primary-100 text-opacity-90">
                    We’ve analysed prices for {data?.listing?.[0].title} from
                    all renters on SHUUT.
                  </p>
                  <p className="text-sm text-primary-100 text-opacity-90">
                    The advert price is above average.
                  </p>
                </TabPane>
                <TabPane key="3" tab="Daily Price">
                  <div className="flex items-center">
                    <p className="inline-flex items-center text-lg font-sofia-pro text-secondary">
                      <span>
                        <Niger />
                      </span>{" "}
                      {data?.listing?.[0].daily_price}/daily{" "}
                    </p>
                    <p className="text-lg font-sofia-pro text-secondary mx-2">
                      -
                    </p>
                    <p className="inline-flex items-center text-lg font-sofia-pro text-secondary">
                      <span>
                        <Niger />
                      </span>{" "}
                      {data?.listing?.[0].daily_price}
                    </p>
                  </div>
                  <p className="text-sm my-5 text-primary-100 text-opacity-90">
                    We’ve analysed prices for {data?.listing?.[0].title} from
                    all renters on SHUUT.
                  </p>
                  <p className="text-sm text-primary-100 text-opacity-90">
                    The advert price is above average.
                  </p>
                </TabPane>
              </Tabs>
            </div>
          </div>
          <div className="">
            <h3 className="mt-10 mb-8 font-lota text-lg text-primary-200">
              Category
            </h3>
            <div className="w-full flex justify-center">
              <div className="relative px-2 py-1.5  border rounded-md">
                <img
                  src={data?.listing?.[0]?.category?.image}
                  alt="Listed Image"
                  width={422}
                  height={256}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <h4 className="font-bold text-primary text-2xl font-sofia-pro my-2">
                {data?.listing?.[0]?.category?.name}
              </h4>
            </div>
            <div className="flex my-2 items-center">
              <h3 className="font-medium text-primary text-lg font-sofia-pro">
                Quantity:
              </h3>
              <span className="ml-2 text-lg">
                {data?.listing?.[0]?.quantity}
              </span>
            </div>
            <h3 className="font-medium text-primary text-lg font-sofia-pro my-2">
              Description
            </h3>
            <p className="text-primary text-base font-medium font-lota pb-4">
              {data?.listing?.[0]?.description}
            </p>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
};

export default Listed;
