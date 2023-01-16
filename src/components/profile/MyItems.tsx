import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { RiEqualizerLine } from "react-icons/ri";
import { AiOutlineCloudDownload } from "react-icons/ai";
import SingleProduct from "../products/SingleProduct";
import { Checkbox, Dropdown, notification, Radio } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import useAsyncEffect from "use-async-effect";
import loadingAnimation from "../lottie/loading.json";
import Lottie from "lottie-react";
import { addDays, format } from "date-fns";
import RequestDetailView from "./RequestDetailView";
import {
  APPROVE_BOOKING_REQUEST,
  APPROVE_EXTEND_REQUEST,
  BOOKING_REQUEST_QUERY,
  GET_MY_UNAVAILABLE_ITEMS,
  GET_USER_LISTINGS,
} from "../../graphql/query_mutations";

type FilterType = "request" | "unavailable" | "my-items" | "";

export const FilterMenu = ({
  onChange,
  value,
}: {
  onChange?: (v: FilterType) => void;
  value?: string;
}) => (
  <Radio.Group
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    className="shadow-md border rounded-[5px] text-primary text-[10px] font-lota bg-white w-[187px]"
  >
    <li className="p-2 border-b hover:text-secondary">
      <Radio>
        <span className="">Date</span>
      </Radio>
    </li>
    <li className="p-2 border-b hover:text-secondary">
      <Radio value={"my-items"}>
        <span className="">My Items</span>
      </Radio>
    </li>
    <li className="p-2 border-b hover:text-secondary">
      <Radio value={"request"}>
        <span className="">In Process</span>
      </Radio>
    </li>
  </Radio.Group>
);

const MyItems = () => {
  const { user } = useAuth();
  const [getBookingRequest, { loading, data }] = useLazyQuery(
    BOOKING_REQUEST_QUERY
  );
  const [getMyListings, { loading: myItemLoading, data: myListings }] =
    useLazyQuery(GET_USER_LISTINGS, {
      fetchPolicy: "cache-and-network",
    });
  const [
    getUnAvailableListing,
    { data: unavailableData, loading: unavailableLoading },
  ] = useLazyQuery(GET_MY_UNAVAILABLE_ITEMS, {
    fetchPolicy: "cache-and-network",
  });
  const [approveBookingRequest, {}] = useMutation(APPROVE_BOOKING_REQUEST, {
    onError(error) {
      setInProgress("");
      setFilter("request");
      notification.error({
        message: error?.message,
      });
    },
    onCompleted(data) {
      notification.success({
        message:
          data.result?.state === "ACCEPTED"
            ? "Booking Request Approved"
            : "Booking Request Declined",
      });
      setInProgress("");
      setView("grid");
      setFilter("request");
    },
  });
  const [approveExtendRequest, {}] = useMutation(APPROVE_EXTEND_REQUEST, {
    onError(error) {
      setInProgress("");
      setFilter("request");
      notification.error({
        message: error?.message,
      });
    },
    onCompleted(data) {
      notification.success({
        message:
          data.result?.state === "EXTENDED"
            ? "Extend Request Approved"
            : "Extend Request Declined",
      });
      setInProgress("");
      setView("grid");
      setFilter("request");
    },
  });
  const [filter, setFilter] = useState<FilterType>("my-items");
  const [view, setView] = useState<"grid" | "detail">("grid");
  const [selectedItem, setSelectedItem] = useState<Record<string, any>>();
  const [inProgress, setInProgress] = useState<"reject" | "approve" | "">("");

  useAsyncEffect(
    async (isMounted) => {
      if (isMounted() && user) {
        switch (filter) {
          case "request":
            await getBookingRequest({
              variables: {
                userId: user?.id,
              },
              fetchPolicy: "cache-and-network",
            });
            return;
          case "my-items":
            await getMyListings({
              variables: {
                userId: user?.id,
              },
            });
            return;
          case "unavailable":
            await getUnAvailableListing({
              variables: {
                user_id: user?.id,
                startdate: format(new Date(), "yyyy-MM-dd"),
                enddate: format(new Date(), "yyyy-MM-dd"),
              },
            });
            return;
          default:
            return null;
        }
      }
    },
    [user?.id, filter]
  );

  useAsyncEffect(
    async (isMounted) => {
      if (isMounted() && user) {
        await Promise.all([
          getBookingRequest({
            variables: {
              userId: user?.id,
            },
          }),
          getUnAvailableListing({
            variables: {
              user_id: user?.id,
              startdate: format(new Date(), "yyyy-MM-dd"),
              enddate: format(new Date(), "yyyy-MM-dd"),
            },
          }),
        ]);
      }
    },
    [user?.id]
  );

  const approveBooking = async (
    bookingId: number,
    isExtension = false,
    extendTo?: string
  ) => {
    setInProgress("approve");
    setFilter("");
    if (isExtension) {
      console.log("extensionRequest: ", isExtension);
      await approveExtendRequest({
        variables: {
          id: bookingId,
          state: "EXTENDED",
          extendTo: extendTo,
        },
      });
    } else {
      await approveBookingRequest({
        variables: {
          id: bookingId,
          state: "ACCEPTED",
        },
      });
    }
  };

  const rejectBooking = async (bookingId: number, isExtension = false) => {
    setInProgress("reject");
    setFilter("");
    if (isExtension) {
      //if extension request is not accepted then we will go back to accepted state
      await approveBookingRequest({
        variables: {
          id: bookingId,
          state: "ACCEPTED",
        },
      });
    } else {
      await approveBookingRequest({
        variables: {
          id: bookingId,
          state: "DECLINED",
        },
      });
    }
  };

  const getStatus = (id: number) => {
    const inProgress =
      data?.booking?.listing?.map((item: any) => item.id) ?? [];
    const rented = unavailableData?.listing?.map((item: any) => item.id) ?? [];

    if (inProgress.includes(id)) {
      return "in progress";
    }

    if (rented.includes(id)) {
      return "rented";
    }
  };
  return (
    <>
      <div className="mt-[60px] w-full lg:flex justify-between">
        <div className="mdMax:flex mdMax:justify-center">
          <div className="flex items-center md:w-[430px] max-w-full border border-body-light rounded-lg p-[2px] relative">
            <input
              placeholder="Search..."
              className="xs:min-w-max px-10 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light bg-transparent"
            />
            <button className="px-7 h-12 bg-secondary text-white min-w-max rounded-r-lg">
              Find Gear
            </button>
            <span className="absolute top-4 left-4 text-lg text-[#263238]">
              <IoIosSearch />
            </span>
          </div>
        </div>
        {view === "grid" ? (
          <div className="mt-5 lg:mt-0 flex items-center xs:justify-center xxs:overflow-x-auto gap-5">
            <button
              onClick={() => setFilter("request")}
              className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota xxs:min-w-max ${
                filter === "request"
                  ? "border-secondary text-secondary"
                  : "border-[#D0CFD84D]"
              }`}
            >
              New Request
            </button>
            <button
              onClick={() => setFilter("unavailable")}
              className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota ${
                filter === "unavailable"
                  ? "border-secondary text-secondary"
                  : "border-[#D0CFD84D]"
              }`}
            >
              Unavailable
            </button>
            <div className="text-3xl text-[#3E4958] hover:text-secondary cursor-pointer">
              <Dropdown
                overlay={<FilterMenu onChange={setFilter} value={filter} />}
                trigger={["click"]}
              >
                <RiEqualizerLine />
              </Dropdown>
            </div>
          </div>
        ) : (
          <div className="flex">
            <button
              onClick={() => setView("grid")}
              className={`px-7 ml-auto md:mt-0 mt-4 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota border-[#D0CFD84D]`}
            >
              List View
            </button>
          </div>
        )}
      </div>
      <div className="w-full lg:mt-[60px] mt-5 flex justify-end xxs:hidden">
        <button className="bg-secondary text-white font-lota rounded-md px-8 py-2.5 flex items-center">
          <AiOutlineCloudDownload className="mr-2 text-lg" />
          Download
        </button>
      </div>
      {view === "grid" ? (
        <div className="xxs:mt-4">
          <h1 className="text-2xl text-primary mb-4">
            {filter === "request"
              ? "New Request"
              : filter === "my-items"
              ? "My Items"
              : "Unavailable"}
          </h1>
          {loading || myItemLoading || unavailableLoading ? (
            <div className="grid place-items-center w-full">
              <Lottie
                animationData={loadingAnimation}
                loop={false}
                style={{ height: 350 }}
              />
            </div>
          ) : (
            <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
              {filter === "request" &&
                data?.booking?.map((booking: Record<string, any>) => (
                  <SingleProduct
                    onClick={() => {
                      setSelectedItem(booking);
                      setView("detail");
                    }}
                    key={booking.id}
                    data={{ ...booking.listing, state: "In Process" }}
                  />
                ))}
              {filter === "my-items" &&
                myListings?.listing?.map((listing: Record<string, any>) => (
                  <SingleProduct
                    key={listing?.id}
                    data={{ ...listing, state: getStatus(listing.id) } as any}
                  />
                ))}
              {filter === "unavailable"
                ? unavailableData?.listing?.map(
                    (listing: Record<string, any>) => (
                      <SingleProduct
                        key={listing?.id}
                        data={{ ...listing, state: "Not Available" } as any}
                      />
                    )
                  )
                : null}
            </div>
          )}
        </div>
      ) : view === "detail" ? (
        <RequestDetailView
          activeFilter={filter}
          loadingState={inProgress}
          reject={rejectBooking}
          approve={approveBooking}
          activeItem={selectedItem}
          bookings={data?.booking}
        />
      ) : null}
    </>
  );
};

export default MyItems;
