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
const BOOKING_REQUEST_QUERY = gql`
  query GetBookings($state: String!, $userId: bigint!) {
    booking(
      where: {
        state: { _eq: $state }
        _and: { listing: { user_id: { _eq: $userId } } }
      }
    ) {
      id
      start
      end
      cost
      discount
      vat
      service_charge
      state
      transaction {
        id
        user {
          id
          firstName
          lastName
          profile_photo
          phone
        }
      }
      listing {
        id
        slug
        title
        daily_price
        location_name
        images {
          url
          id
        }
      }
    }
  }
`;

const GET_MY_LISTINGS = gql`
  query GetMyListings($userId: bigint!) {
    listing(where: { user_id: { _eq: $userId } }) {
      id
      slug
      title
      daily_price
      location_name
      images {
        url
        id
      }
      user {
        firstName
        lastName
        id
      }
    }
  }
`;

const UPDATE_BOOKING_STATE_MUTATION = gql`
  mutation UpdateBookingState($id: bigint!, $state: String!) {
    result: update_booking_by_pk(
      pk_columns: { id: $id }
      _set: { state: $state }
    ) {
      id
      state
    }
  }
`;

const MyItems = () => {
  const { user } = useAuth();
  const [getBookingRequest, { loading, data }] = useLazyQuery(
    BOOKING_REQUEST_QUERY
  );
  const [getMyListings, { loading: myItemLoading, data: myListings }] =
    useLazyQuery(GET_MY_LISTINGS);
  const [updateBookingState, {}] = useMutation(UPDATE_BOOKING_STATE_MUTATION, {
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
                state: "PENDING",
              },
              fetchPolicy: "cache-and-network",
            });
            return;
          case "my-items":
            await getMyListings({
              variables: {
                userId: user?.id,
              },
              fetchPolicy: "cache-and-network",
            });
            return;
          default:
            return null;
        }
      }
    },
    [user?.id, filter]
  );

  const approveBooking = async (bookingId: number) => {
    setInProgress("approve");
    setFilter("");
    await updateBookingState({
      variables: {
        id: bookingId,
        state: "ACCEPTED",
      },
    });
  };

  const rejectBooking = async (bookingId: number) => {
    setInProgress("reject");
    setFilter("");
    await updateBookingState({
      variables: {
        id: bookingId,
        state: "DECLINED",
      },
    });
  };

  return (
    <>
      <div className="mt-[60px] w-full md:flex justify-between">
        <div className="">
          <div className="flex items-center md:w-[430px] max-w-full border border-body-light rounded-lg p-[2px] relative">
            <input
              placeholder="Search..."
              className="min-w-max px-10 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light bg-transparent"
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
          <div className="mt-5 md:mt-0 flex items-center gap-5">
            <button
              onClick={() => setFilter("request")}
              className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota ${
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
          <div>
            <button
              onClick={() => setView("grid")}
              className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota border-[#D0CFD84D]`}
            >
              List View
            </button>
          </div>
        )}
      </div>
      <div className="w-full mt-[60px] flex justify-end">
        <button className="bg-secondary text-white font-lota rounded-md px-8 py-2.5 flex items-center">
          <AiOutlineCloudDownload className="mr-2 text-lg" />
          Download
        </button>
      </div>
      {view === "grid" ? (
        <div className="">
          <h1 className="text-2xl text-primary mb-4">
            {filter === "request"
              ? "New Request"
              : filter === "my-items"
              ? "My Items"
              : "Unavailable"}
          </h1>
          {loading || myItemLoading ? (
            <div className="grid place-items-center w-full">
              <Lottie
                animationData={loadingAnimation}
                loop={false}
                style={{ height: 350 }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-4">
              {(filter === "request" || filter === "unavailable") &&
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
                  <SingleProduct key={listing?.id} data={listing as any} />
                ))}
            </div>
          )}
        </div>
      ) : view === "detail" ? (
        <RequestDetailView
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
