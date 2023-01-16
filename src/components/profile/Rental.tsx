import React, { useMemo, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { RiEqualizerLine } from "react-icons/ri";
import { AiOutlineCloudDownload } from "react-icons/ai";
import SingleProduct from "../products/SingleProduct";
import { Checkbox, Dropdown, notification, Radio } from "antd";
import RentalDetailView from "./RentalDetailView";
import { useAuth } from "../../hooks/useAuth";
import { gql, useLazyQuery } from "@apollo/client";
import useAsyncEffect from "use-async-effect";
import loadingAnimation from "../lottie/loading.json";
import Lottie from "lottie-react";
import { addDays, format } from "date-fns";
import {
  GET_HAND_IN_LISTINGS,
  GET_MY_BOOKINGS,
} from "../../graphql/query_mutations";

type FilterType =
  | "request"
  | "handin-today"
  | "handin-tomorrow"
  | "rented"
  | "returned";

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
      <Radio value={"rented"}>
        <span className="">Rented</span>
      </Radio>
    </li>
    <li className="p-2 border-b hover:text-secondary">
      <Radio value={"request"}>
        <span className="">In Process</span>
      </Radio>
    </li>
  </Radio.Group>
);

const Rental = () => {
  const { user } = useAuth();
  const [getMyBookings, { loading, data }] = useLazyQuery(GET_MY_BOOKINGS, {
    fetchPolicy: "cache-and-network",
  });

  const [
    getHandInListing,
    { loading: handoverItemLoading, data: handOverItems },
  ] = useLazyQuery(GET_HAND_IN_LISTINGS, {
    onError(error) {
      notification.error({
        message: error.message,
      });
    },
    fetchPolicy: "cache-and-network",
  });
  const [filter, setFilter] = useState<FilterType>("request");
  const [view, setView] = useState<"grid" | "detail">("grid");
  const [selectedItem, setSelectedItem] = useState<Record<string, any>>();

  const fetchData = async (_f: FilterType) => {
    switch (_f) {
      case "request":
        let start = format(new Date(), "yyyy-MM-dd");
        await getMyBookings({
          variables: {
            customer: user?.id,
            state: [{ state: { _eq: "PENDING" } }],
            start: start,
          },
        });
        return;
      case "handin-today":
        start = format(addDays(new Date(), 1), "yyyy-MM-dd");
        await getHandInListing({
          variables: {
            customer: user?.id,
            state: "ACCEPTED",
            start: start,
          },
        });
        return;
      case "handin-tomorrow":
        start = format(addDays(new Date(), 2), "yyyy-MM-dd");
        await getHandInListing({
          variables: {
            customer: user?.id,
            state: "ACCEPTED",
            start: start,
          },
        });
        return;
      case "returned":
        await await getMyBookings({
          variables: {
            customer: user?.id,
            state: [{ state: { _eq: "RETURNED" } }],
          },
        });
        return;
      case "rented":
        start = format(new Date(), "yyyy-MM-dd");
        await await getMyBookings({
          variables: {
            customer: user?.id,
            state: [
              { state: { _eq: "ACCEPTED" } },
              { state: { _eq: "EXTEND" } },
              { state: { _eq: "EXTENDED" } },
            ],
            start,
          },
        });
        return;
      default:
        return null;
    }
  };

  useAsyncEffect(
    async (isMounted) => {
      if (isMounted() && user) {
        await fetchData(filter);
      }
    },
    [user?.id, filter]
  );

  const activeTitle = useMemo(() => {
    let title = "";
    switch (filter) {
      case "request":
        title = "My Request";
        break;
      case "handin-today":
        title = "Hand in today";
        break;
      case "handin-tomorrow":
        title = "Hand in tomorrow";
        break;
      case "returned":
        title = "Returned";
        break;
      case "rented":
        title = "Rented";
        break;
    }
    return <h1 className="text-2xl text-primary mb-4">{title}</h1>;
  }, [filter]);
  return (
    <>
      <div className="mt-[60px] w-full xl:flex justify-between">
        <div className="lgMax:flex lgMax:justify-center">
          <div className="flex items-center lg:w-[430px] w-full max-w-full border border-body-light rounded-lg p-[2px] relative">
            <input
              placeholder="Search..."
              className="sm:min-w-max px-10 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light bg-transparent"
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
          <div className="lgMax:mt-5 flex items-center xl:justify-end lg:justify-center mdMax:snap-mandatory mdMax:overflow-x-auto mdMax:snap-x gap-x-5">
            <button
              onClick={() => setFilter("request")}
              className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota min-w-max ${
                filter === "request"
                  ? "border-secondary text-secondary"
                  : "border-[#D0CFD84D]"
              }`}
            >
              New Request
            </button>
            <button
              onClick={() => setFilter("handin-today")}
              className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota min-w-max ${
                filter === "handin-today"
                  ? "border-secondary text-secondary"
                  : "border-[#D0CFD84D]"
              }`}
            >
              Hand in today
            </button>
            <button
              onClick={() => setFilter("handin-tomorrow")}
              className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota min-w-max ${
                filter === "handin-tomorrow"
                  ? "border-secondary text-secondary"
                  : "border-[#D0CFD84D]"
              }`}
            >
              Hand in tomorrow
            </button>
            <button
              onClick={() => setFilter("returned")}
              className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota ${
                filter === "returned"
                  ? "border-secondary text-secondary"
                  : "border-[#D0CFD84D]"
              }`}
            >
              Returned
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
              className={`ml-auto px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota border-[#D0CFD84D] mt-4`}
            >
              List View
            </button>
          </div>
        )}
      </div>
      <div className="w-full lg:mt-[60px] mt-5 flex justify-end">
        <button
          className={`${
            (filter === "handin-today" ||
              filter === "handin-tomorrow" ||
              filter === "rented") &&
            view == "detail"
              ? "bg-[#06E775]"
              : "bg-secondary"
          }  text-white font-lota rounded-md px-8 py-2.5 flex items-center`}
        >
          {filter === "request" && view === "detail" ? (
            "Awaiting Approval"
          ) : filter !== "request" && view === "detail" ? (
            "Rented"
          ) : (
            <span className="inline-flex">
              <AiOutlineCloudDownload className="mr-2 text-lg" />
              Download
            </span>
          )}
        </button>
      </div>
      {view === "grid" ? (
        <div className="">
          {activeTitle}
          {loading || handoverItemLoading ? (
            <div className="grid place-items-center w-full">
              <Lottie
                animationData={loadingAnimation}
                loop={true}
                style={{ height: 350 }}
              />
            </div>
          ) : (
            <div className="grid 2xl:grid-cols-5 lg:grid-cols-4 md:gird-cols-3 sm:grid-cols-2 grid-cols-1  gap-4">
              {filter === "request" ||
              filter === "returned" ||
              filter === "rented"
                ? data?.booking?.map((booking: Record<string, any>) => (
                    <SingleProduct
                      onClick={() => {
                        setSelectedItem(booking);
                        setView("detail");
                      }}
                      key={booking.id}
                      data={{
                        ...booking.listing,
                        state: filter === "request" ? "In Progress" : filter,
                      }}
                    />
                  ))
                : null}

              {filter === "handin-today" || filter === "handin-tomorrow"
                ? handOverItems?.booking?.map(
                    (booking: Record<string, any>) => (
                      <SingleProduct
                        onClick={() => {
                          setSelectedItem(booking);
                          setView("detail");
                        }}
                        key={booking.id}
                        data={{ ...booking.listing, state: "Rented" }}
                      />
                    )
                  )
                : null}
            </div>
          )}
        </div>
      ) : view === "detail" ? (
        <RentalDetailView
          activeFilter={filter}
          activeItem={selectedItem}
          resetView={(_f = "rented") => {
            setView("grid");
            setFilter(_f as FilterType);
            fetchData(_f as FilterType);
          }}
          bookings={
            filter === "handin-today" || "handin-tomorrow"
              ? handOverItems?.booking
              : data?.booking
          }
        />
      ) : null}
    </>
  );
};

export default Rental;
