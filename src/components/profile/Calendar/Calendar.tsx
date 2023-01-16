import React, { useState } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import SingleProduct from "../../products/SingleProduct";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import Modal from "../../UI/Modal";
import DatePicker from "../../DatePicker";
import { DateRange, Matcher } from "react-day-picker";
import CalendarIcon from "../../icons/CalendarIcon";
import useAsyncEffect from "use-async-effect";
import { useAuth } from "../../../hooks/useAuth";
import { addDays, format } from "date-fns";
import { checkDateOverlaps } from "../../../utils/utils";
import ActionButton from "./ActionButton";
import OutlinedButton from "./OutlinedButton";
import { notification, Spin } from "antd";
import { GoPlusSmall } from "react-icons/go";
import {
  ADD_UNAVAILABILITY,
  CHECK_DATE_QUERY,
  GET_MY_LISTINGS,
} from "../../../graphql/query_mutations";

type FilterType = "today" | "check-date" | "add-unavailability";

const Calendar = () => {
  const { user } = useAuth();
  const [getBookings, { loading, data }] = useLazyQuery(CHECK_DATE_QUERY);
  const [getMyListings, { data: myListing }] = useLazyQuery(GET_MY_LISTINGS);
  const [addUnavailability, { loading: updateLoading }] = useMutation(
    ADD_UNAVAILABILITY,
    {
      onCompleted() {
        getMyListings({
          variables: {
            userId: user?.id,
            start: format(new Date(), "yyyy-MM-dd"),
          },
          fetchPolicy: "network-only",
        });
        notification.success({
          message: "unavailability updated",
        });
        setShowUnavailabilityCalendar(false);
        setSelectedUnAvailableDate(undefined);
      },
      onError(error) {
        notification.error({
          message: error.message,
        });
      },
    }
  );
  const [selectedDate, setSelectedDate] = useState<DateRange>();
  const [visibleDatePicker, setVisibleDatePicker] = useState(false);
  const [filter, setFilter] = useState<FilterType>("today");
  const [disabledDays, setDisabledDays] = useState<Matcher | Matcher[]>([]);
  const [selectedListing, setSelectedListing] = useState<Record<string, any>>();
  const [selectedUnavailableDate, setSelectedUnAvailableDate] =
    useState<DateRange>();
  const [showUnavailabilityCalendar, setShowUnavailabilityCalendar] =
    useState(false);

  useAsyncEffect(
    async (isMounted) => {
      if (isMounted()) {
        if (filter === "today") {
          await getBookings({
            variables: {
              userId: user?.id,
              start: format(new Date(), "yyyy-MM-dd"),
              end: format(new Date(), "yyyy-MM-dd"),
            },
          });
        }
        if (filter === "add-unavailability") {
          await getMyListings({
            variables: {
              userId: user?.id,
              start: format(new Date(), "yyyy-MM-dd"),
            },
          });
        }
      }
    },
    [user, filter]
  );

  const onAddUnavailability = (listingId: number) => {
    const listing = myListing.listing?.find(
      (item: Record<string, any>) => item.id === listingId
    );
    setSelectedListing(listing);

    const blockedDays: any = [{ before: new Date() }];
    const filterRedBooking: any = {};

    for (const item of listing.bookings ?? []) {
      const key = `${item.start}-${item.end}`;
      if (filterRedBooking[key]) {
        filterRedBooking[key].quantity += item.quantity;
      } else {
        filterRedBooking[key] = {
          from: new Date(item.start),
          to: new Date(item.end),
          quantity: item.quantity,
        };
      }
    }

    const overlapsed: Record<string, any>[] = Object.values(filterRedBooking);
    for (let i = 0; i < overlapsed.length - 1; i += 1) {
      for (let j = i + 1; j < overlapsed.length; j += 1) {
        if (
          checkDateOverlaps(
            overlapsed[i].from,
            overlapsed[i].to,
            overlapsed[j].from,
            overlapsed[j].to
          )
        ) {
          overlapsed[i].quantity += overlapsed[j].quantity;
        }
      }
    }

    for (const k in overlapsed) {
      if (overlapsed[k].quantity < listing.quantity) {
        delete overlapsed[k];
      }
    }
    if (listing.availability_exceptions) {
      if (Array.isArray(listing.availability_exceptions)) {
        console.log("item: ", listing.availability_exceptions);
        for (let item of listing.availability_exceptions) {
          blockedDays.push({
            from: new Date(item.from),
            to: new Date(item.to),
          });
        }
      } else {
        blockedDays.push({
          from: new Date(listing.availability_exceptions.from),
          to: new Date(listing.availability_exceptions.to),
        });
      }
    }
    setDisabledDays([...blockedDays, ...overlapsed]);
    setShowUnavailabilityCalendar(true);
  };

  const onUpdateUnavailability = async () => {
    let unavailability: Record<string, any>[] = [];
    if (selectedUnavailableDate) {
      unavailability.push({
        from: format(selectedUnavailableDate?.from as Date, "yyyy-MM-dd"),
        to: format(selectedUnavailableDate?.to as Date, "yyyy-MM-dd"),
      });
    }
    if (
      selectedListing?.availability_exceptions &&
      Array.isArray(selectedListing?.availability_exceptions)
    ) {
      unavailability = [
        ...unavailability,
        ...selectedListing?.availability_exceptions,
      ];
    } else if (selectedListing?.availability_exceptions) {
      unavailability = [
        ...unavailability,
        selectedListing?.availability_exceptions,
      ];
    }

    await addUnavailability({
      variables: {
        exceptions: unavailability,
        listing_id: selectedListing?.id,
      },
    });
  };

  const getStatus = (listing: Record<string, any>) => {
    const currentDate = format(new Date(), "yyyy-MM-dd");
    if (
      listing?.availability_exceptions &&
      Array.isArray(listing.availability_exceptions)
    ) {
      for (const exception of listing?.availability_exceptions) {
        if (
          checkDateOverlaps(
            new Date(currentDate),
            new Date(currentDate),
            new Date(exception?.from),
            new Date(exception?.to)
          )
        ) {
          return "unavailable";
        }
      }
    } else if (listing?.availability_exceptions) {
      if (
        checkDateOverlaps(
          new Date(currentDate),
          new Date(currentDate),
          new Date(listing?.availability_exceptions.from),
          new Date(listing?.availability_exceptions.to)
        )
      ) {
        return "unavailable";
      }
    }

    for (const booking of listing?.bookings ?? []) {
      if (
        booking.start === currentDate ||
        booking.start ===
          format(addDays(new Date(currentDate), 1), "yyyy-MM-dd")
      ) {
        return "Hand Over";
      }
      if (
        booking.end === currentDate ||
        booking.end == format(addDays(new Date(currentDate), 1), "yyyy-MM-dd")
      ) {
        return "Hand In";
      }
      if (
        checkDateOverlaps(
          new Date(currentDate),
          new Date(currentDate),
          new Date(booking.start),
          new Date(booking.end)
        )
      ) {
        return "unavailable";
      }
    }
  };

  return (
    <>
      <div className="w-full md:mt-[60px] mt-5 flex md:justify-end md gap-2 overflow-x-auto">
        <OutlinedButton
          className="min-w-max"
          onClick={() => setFilter("check-date")}
          isActive={filter === "check-date"}
        >
          Check Dates
        </OutlinedButton>
        <OutlinedButton
          className="min-w-max flex items-center"
          onClick={() => setFilter("add-unavailability")}
          isActive={filter === "add-unavailability"}
        >
          <span className="text-base">
            <GoPlusSmall />
          </span>{" "}
          Unavailability
        </OutlinedButton>
        <button className="bg-secondary text-white font-lota rounded-md px-8 py-2.5 flex items-center min-w-max">
          <AiOutlineCloudDownload className="mr-2 text-lg" />
          Download
        </button>
      </div>
      <div className="flex justify-end sm:mt-20 mt-5 mb-2">
        {filter === "check-date" ? (
          <button
            onClick={() => setVisibleDatePicker(true)}
            className="flex items-center border border-secondary rounded-md h-[45px] justify-between px-4 text-secondary capitalize text-sm font-normal font-lota"
          >
            <div className="inline-flex items-center">
              <span className="mr-1">
                <CalendarIcon />
              </span>
              {selectedDate?.from
                ? format(selectedDate.from, "yyyy-MM-dd")
                : "Start Date"}
            </div>
            <span className="mx-3">-</span>
            <div className="inline-flex items-center">
              <span className="mr-1">
                <CalendarIcon />
              </span>
              {selectedDate?.to
                ? format(selectedDate.to, "yyyy-MM-dd")
                : "End Date"}
            </div>
          </button>
        ) : null}
      </div>
      <div className="">
        <h1 className="text-2xl text-primary">
          {filter === "today"
            ? "Today"
            : filter === "check-date"
            ? "Check Dates"
            : "Add Unavailability"}
        </h1>
        <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mt-4">
          {filter === "check-date" || filter === "today"
            ? data?.booking?.map((booking: Record<string, any>) => (
                <SingleProduct
                  data={{
                    ...booking.listing,
                    state:
                      booking.start === format(new Date(), "yyyy-MM-dd")
                        ? "Hand Over"
                        : booking.end === format(new Date(), "yyyy-MM-dd")
                        ? "Hand In"
                        : "Unavailable",
                  }}
                  key={booking?.id}
                />
              ))
            : null}

          {filter === "add-unavailability"
            ? myListing?.listing?.map((listing: Record<string, any>) => (
                <SingleProduct
                  action={
                    <ActionButton
                      onClick={() => onAddUnavailability(listing.id)}
                    />
                  }
                  data={{ ...listing, state: getStatus(listing) } as any}
                  key={listing?.id}
                />
              ))
            : null}
        </div>
      </div>
      <Modal
        onCancel={() => setVisibleDatePicker(false)}
        open={visibleDatePicker}
        width={750}
      >
        <div className="w-full flex justify-center items-center px-10 pt-10">
          <div className="shadow rounded-lg px-5">
            <DatePicker
              disableBefore={false}
              selected={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-5 py-2">
          <button
            onClick={() => {
              setSelectedDate(undefined);
              setVisibleDatePicker(false);
            }}
            className="px-8 font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold"
          >
            Clear
          </button>
          <button
            disabled={!selectedDate?.from || !selectedDate?.to}
            onClick={async () => {
              setVisibleDatePicker(false);
              if (selectedDate?.from && selectedDate?.to) {
                await getBookings({
                  variables: {
                    userId: user?.id,
                    start: format(selectedDate.from, "yyyy-MM-dd"),
                    end: format(selectedDate.to, "yyyy-MM-dd"),
                  },
                });
              }
            }}
            className="w-[244px] purple-button font-sofia-pro bg-secondary hover:bg-primary disabled:bg-primary disabled:cursor-not-allowed rounded-md text-white h-12 items-center text-lg font-semibold"
          >
            Submit
          </button>
        </div>
      </Modal>

      <Modal
        onCancel={() => setShowUnavailabilityCalendar(false)}
        open={showUnavailabilityCalendar}
        width={750}
      >
        <div className="w-full flex justify-center items-center px-10 pt-10">
          <div className="shadow rounded-lg px-5">
            <DatePicker
              disabled={disabledDays}
              selected={selectedUnavailableDate}
              onChange={setSelectedUnAvailableDate}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-5 py-2">
          <button
            onClick={() => {
              setSelectedUnAvailableDate(undefined);
            }}
            className="px-8 font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold"
          >
            Clear
          </button>
          <button
            disabled={
              !selectedUnavailableDate?.from || !selectedUnavailableDate?.to
            }
            onClick={onUpdateUnavailability}
            className="w-[244px] purple-button font-sofia-pro bg-secondary hover:bg-primary disabled:bg-primary disabled:cursor-not-allowed rounded-md text-white h-12 items-center text-lg font-semibold"
          >
            {updateLoading ? <Spin size="small" /> : "Submit"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Calendar;
