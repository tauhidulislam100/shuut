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

type FilterType =
  | "request"
  | "handover-today"
  | "handover-tomorrow"
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

const GET_MY_BOOKINGS = gql`
  query GetBookings(
    $state: [booking_bool_exp!]
    $customer: bigint!
    $start: date
  ) {
    booking(
      where: {
        _or: $state
        _and: { transaction: { customer: { _eq: $customer } } }
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
      pricing_option
      extend_to
      extend_from
      is_extension_paid
      transaction_id
      listing {
        id
        slug
        title
        daily_price
        weekly_price
        monthly_price
        location_name
        availability_exceptions
        quantity
        images {
          url
          id
        }
        user {
          firstName
          lastName
          id
          profile_photo
        }
        bookings(
          where: {
            _or: [{ start: { _gte: $start } }, { end: { _gte: $start } }]
            _and: [
              { state: { _neq: "PROPOSED" } }
              { state: { _neq: "CANCELLED" } }
              { state: { _neq: "DECLINED" } }
            ]
          }
        ) {
          start
          end
          quantity
        }
      }
    }
  }
`;

const queryHandOverListing = gql`
  query GetBookings($state: String!, $customer: bigint!, $start: date!) {
    booking(
      where: {
        state: { _eq: $state }
        _and: {
          transaction: { customer: { _eq: $customer } }
          start: { _eq: $start }
        }
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
      pricing_option
      extend_from
      is_extension_paid
      transaction_id
      listing {
        id
        slug
        title
        daily_price
        weekly_price
        monthly_price
        location_name
        availability_exceptions
        quantity
        images {
          url
          id
        }
        user {
          firstName
          lastName
          id
          profile_photo
        }
        bookings(
          where: {
            _or: [{ start: { _gte: $start } }, { end: { _gte: $start } }]
            _and: [
              { state: { _neq: "PROPOSED" } }
              { state: { _neq: "CANCELLED" } }
              { state: { _neq: "DECLINED" } }
            ]
          }
        ) {
          start
          end
          quantity
        }
      }
    }
  }
`;

const Rental = () => {
  const { user } = useAuth();
  const [getMyBookings, { loading, data }] = useLazyQuery(GET_MY_BOOKINGS, {
    fetchPolicy: "cache-and-network",
  });

  const [
    getHandOverListing,
    { loading: handoverItemLoading, data: handOverItems },
  ] = useLazyQuery(queryHandOverListing, {
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

  useAsyncEffect(
    async (isMounted) => {
      if (isMounted() && user) {
        switch (filter) {
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
          case "handover-today":
            start = format(addDays(new Date(), 1), "yyyy-MM-dd");
            await getHandOverListing({
              variables: {
                customer: user.id,
                state: "ACCEPTED",
                start: start,
              },
            });
            return;
          case "handover-tomorrow":
            start = format(addDays(new Date(), 2), "yyyy-MM-dd");
            await getHandOverListing({
              variables: {
                customer: user.id,
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
      case "handover-today":
        title = "Handover Today";
        break;
      case "handover-tomorrow":
        title = "Handover Tomorrow";
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
              onClick={() => setFilter("handover-today")}
              className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota ${
                filter === "handover-today"
                  ? "border-secondary text-secondary"
                  : "border-[#D0CFD84D]"
              }`}
            >
              Handover Today
            </button>
            <button
              onClick={() => setFilter("handover-tomorrow")}
              className={`px-7 py-2.5 bg-[#FCFCFD] border-[0.5px] rounded-md font-lota ${
                filter === "handover-tomorrow"
                  ? "border-secondary text-secondary"
                  : "border-[#D0CFD84D]"
              }`}
            >
              Handover Tomorrow
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
        <button
          className={`${
            (filter === "handover-today" ||
              filter === "handover-tomorrow" ||
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
            <div className="grid grid-cols-5 gap-4">
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

              {filter === "handover-today" || filter === "handover-tomorrow"
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
          setFilter={setFilter}
          resetView={() => setView("grid")}
          bookings={
            filter === "handover-today" || "handover-tomorrow"
              ? handOverItems?.booking
              : data?.booking
          }
        />
      ) : null}
    </>
  );
};

export default Rental;
