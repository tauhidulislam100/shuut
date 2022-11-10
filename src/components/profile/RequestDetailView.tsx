import { Avatar, Collapse, Spin } from "antd";
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  format,
} from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsPlus, BsX } from "react-icons/bs";
import { useGlobalState } from "../../hooks/useGlobalState";
import { turnicate } from "../../utils/utils";

const ShortListingInfo = ({
  booking,
  onClick,
}: {
  booking: Record<string, any>;
  onClick?: () => void;
}) => {
  return (
    <div
      className=" bg-[#F8F8F8] rounded-[5px] border mb-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="border-b p-5">
        <h3 className="text-primary font-semibold">Action Required</h3>
      </div>
      <div className="flex justify-between items-start p-5">
        <div className="flex items-start">
          <div className="relative">
            <img
              src={booking?.listing?.images?.[0]?.url}
              alt={booking?.listing?.title}
              className="w-[166px] h-[129px]"
            />
          </div>
          <h5 className="text-primary-100 pl-4">
            {turnicate(booking?.listing?.title, 30)}
          </h5>
        </div>
        <div className="">
          <p className="text-primary-100/30">
            {booking?.start} - {booking?.end}
          </p>
        </div>
      </div>
      <div className="flex justify-end px-5">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Avatar size={50} src={booking?.transaction?.user?.profile_photo} />
          </div>
          <h4 className="text-primary-100/30">
            {booking?.transaction?.user?.firstName}{" "}
            {booking?.transaction?.user?.lastName}
          </h4>
        </div>
      </div>
      <button className="bg-secondary text-white w-full hover:bg-primary py-2.5 text-sm font-sofia-pro mt-4">
        {booking.state === "EXTEND"
          ? "Pending Extension Confirmation"
          : "Pending Availability Confirmation"}
      </button>
    </div>
  );
};

interface IProps {
  bookings: Record<string, any>[];
  activeItem?: Record<string, any>;
  approve?: (
    bookingId: number,
    isExtension?: boolean,
    extendTo?: string
  ) => void;
  reject?: (bookingId: number, isExtension?: boolean) => void;
  loadingState?: string;
  activeFilter?: string;
}

const RequestDetailView = ({
  bookings = [],
  activeItem,
  loadingState,
  activeFilter,
  reject,
  approve,
}: IProps) => {
  const [selectedBooking, setSelectedBooking] = useState<
    Record<string, any> | undefined
  >(activeItem);
  const { SERVICE_CHARGE, SERVICE_VAT } = useGlobalState();
  const [extensionCost, setExtensionCost] = useState(0);

  useEffect(() => {
    if (selectedBooking?.state === "EXTEND") {
      switch (selectedBooking?.pricing_option) {
        case "weekly":
          const weeks = differenceInCalendarWeeks(
            new Date(selectedBooking.extend_to),
            new Date(selectedBooking.end)
          );
          setExtensionCost(weeks * selectedBooking.listing.weekly_price);
          break;
        case "monthly":
          const months = differenceInCalendarMonths(
            new Date(selectedBooking.extend_to),
            new Date(selectedBooking.end)
          );
          setExtensionCost(months * selectedBooking.listing.montly_price);
          break;
        case "daily":
          const days = differenceInCalendarDays(
            new Date(selectedBooking.extend_to),
            new Date(selectedBooking.end)
          );
          console.log("days ", days);
          setExtensionCost(days * selectedBooking?.listing?.daily_price);
        default:
          break;
      }
    }
  }, [selectedBooking]);

  return (
    <div className="font-lota">
      <h1 className="text-[32px] text-primary">
        {activeFilter === "handover-today" ||
        activeFilter === "handover-tommorow" ||
        activeFilter === "rented"
          ? "Approved"
          : "Rentals"}
      </h1>
      <div className="mt-5">
        <div className="grid grid-cols-2 gap-10 items-start">
          <div>
            <ShortListingInfo
              key={activeItem?.id}
              booking={activeItem as Record<string, any>}
            />
            {bookings
              .filter((b) => b.id !== activeItem?.id)
              .map((booking) => (
                <ShortListingInfo
                  key={booking.id}
                  booking={booking}
                  onClick={() => {
                    setSelectedBooking(booking);
                    console.log("booking: ", booking);
                  }}
                />
              ))}
          </div>

          <div className="bg-[#F8F8F8] rounded-[5px] border p-5">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <div className="relative">
                  <img
                    alt={selectedBooking?.listing?.title}
                    src={selectedBooking?.listing?.images?.[0]?.url}
                    className="w-[166px] h-[129px] object-cover"
                  />
                </div>
                <h5 className="text-primary-100 pl-4">
                  {turnicate(selectedBooking?.listing?.title, 30)}
                </h5>
              </div>
              <div className="">
                <p className="text-primary-100">
                  {format(new Date(selectedBooking?.start as string), "do MMM")}{" "}
                  - {selectedBooking?.end}
                </p>
                <p>Location: </p>
                <p>Phone Number: {selectedBooking?.transaction?.user?.phone}</p>
              </div>
            </div>
            <h2 className="mt-4 font-sofia-pro font-medium text-primary-100">
              <span className="text-base font-normal text-[#677489]">
                Renter:
              </span>{" "}
              {selectedBooking?.transaction?.user?.firstName}{" "}
              {selectedBooking?.transaction?.user?.lastName}
            </h2>
            <div className="mt-8 flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Avatar
                    src={selectedBooking?.transaction?.user?.profile_photo}
                    size={50}
                  />
                </div>
                <h4 className="text-primary-100/30">Answers fast</h4>
              </div>
              <div className="flex flex-col items-end gap-y-10">
                <button
                  onClick={() => console.log("button")}
                  className="min-w-[155px] btn h-11 bg-transparent border border-secondary text-secondary hover:bg-primary hover:text-white"
                >
                  Message {selectedBooking?.transaction?.user?.firstName}
                </button>

                <div className="flex items-center gap-10">
                  <button
                    onClick={() =>
                      reject?.(
                        selectedBooking?.id,
                        selectedBooking?.state === "EXTEND"
                      )
                    }
                    className="min-w-[155px] btn h-11 bg-[#EB001B] text-white purple-button"
                  >
                    {loadingState === "reject" ? (
                      <Spin size="small" />
                    ) : (
                      "Reject"
                    )}
                  </button>
                  <button
                    onClick={() =>
                      approve?.(
                        selectedBooking?.id,
                        selectedBooking?.state === "EXTEND",
                        selectedBooking?.extend_to
                      )
                    }
                    className="min-w-[155px] btn h-11 bg-secondary  hover:bg-primary text-white purple-button"
                  >
                    {loadingState === "approve" ? (
                      <Spin size="small" />
                    ) : (
                      "Approve"
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="border-b my-10"></div>
            {extensionCost ? (
              <div className="font-lota px-5 text-sm">
                <h1 className="text-primary font-semibold">
                  Transaction Summary
                </h1>
                <div className="flex justify-between items-end mt-10">
                  <p className="text-[#677489]">
                    {differenceInCalendarDays(
                      new Date(selectedBooking?.extend_to),
                      new Date(selectedBooking?.extend_from)
                    )}{" "}
                    Days of extension
                  </p>
                  <p className="text-[#111729]">₦{extensionCost}</p>
                </div>
                <hr className="my-8" />
                <div className="flex justify-between items-center">
                  <h1 className="text-primary font-semibold">
                    Payment Information
                  </h1>
                  <h2 className="text-primary-100/30 underline">Invoice</h2>
                </div>
                <div className="flex justify-between items-center mt-10">
                  <p className="text-[#677489]">Cost of Service</p>
                  <p className="text-[#111729]">₦{extensionCost}</p>
                </div>
                <div className="flex justify-between items-center py-4">
                  <p className="text-[#677489]">Total Rental Fee</p>
                  <p className="text-[#111729]">
                    ₦{extensionCost * Number(SERVICE_CHARGE)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#677489]">VAT</p>
                  <p className="text-[#111729]">
                    ₦
                    {extensionCost * Number(SERVICE_CHARGE) +
                      extensionCost * Number(SERVICE_VAT)}
                  </p>
                </div>
                <div className="border-b mt-5 mb-2.5"></div>
                <div className="flex justify-between items-center">
                  <p className="text-[#111729] text-sm">Total</p>
                  <p className="text-secondary text-sm font-semibold">
                    ₦
                    {extensionCost +
                      extensionCost * Number(SERVICE_CHARGE) +
                      extensionCost * Number(SERVICE_VAT)}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="font-lota px-5 text-sm">
                  <div className="flex justify-between items-center">
                    <h1 className="text-primary font-semibold">
                      Payment Information
                    </h1>
                    <h2 className="text-primary-100/30 underline">Invoice</h2>
                  </div>
                  <div className="flex justify-between items-center mt-12">
                    <p className="text-[#677489]">Cost of Service</p>
                    <p className="text-[#111729]">₦{selectedBooking?.cost}</p>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <p className="text-[#677489]">Total Rental Fee</p>
                    <p className="text-[#111729]">
                      ₦{selectedBooking?.service_charge}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[#677489]">VAT</p>
                    <p className="text-[#111729]">₦{selectedBooking?.vat}</p>
                  </div>
                  <div className="border-b mt-5 mb-2.5"></div>
                  <div className="flex justify-between items-center">
                    <p className="text-[#111729] text-sm">Total</p>
                    <p className="text-secondary text-sm font-semibold">
                      ₦
                      {selectedBooking?.cost +
                        selectedBooking?.vat +
                        selectedBooking?.service_charge}
                    </p>
                  </div>
                </div>
                <div className="border-b mt-10"></div>
                <h1 className="mt-10 uppercase font-lota font-semibold text-primary">
                  Faq
                </h1>
                <div className="active-state">
                  <Collapse
                    className="w-full faq-collapse"
                    bordered={false}
                    expandIconPosition="end"
                    expandIcon={(p) =>
                      p.isActive ? (
                        <span>
                          <BsX />
                        </span>
                      ) : (
                        <span>
                          <BsPlus />
                        </span>
                      )
                    }
                  >
                    <Collapse.Panel
                      key={"1"}
                      header="How secured is my Equipment?"
                    >
                      <p>
                        We are currently in the process of identifying
                        interested founding members. When at least 100 have made
                        a verbal commitment, the process of negotiating with
                        potential partner nations can begin. There is no
                        financial obligation until the founding members have
                        approved a negotiated deal.
                      </p>
                    </Collapse.Panel>
                    <Collapse.Panel
                      key={"2"}
                      header="Do renter pay for equipment transportation?"
                    >
                      <p>
                        We are currently in the process of identifying
                        interested founding members. When at least 100 have made
                        a verbal commitment, the process of negotiating with
                        potential partner nations can begin. There is no
                        financial obligation until the founding members have
                        approved a negotiated deal.
                      </p>
                    </Collapse.Panel>
                    <Collapse.Panel
                      key={"3"}
                      header="How much money is needed for insurance ?"
                    >
                      <p>
                        We are currently in the process of identifying
                        interested founding members. When at least 100 have made
                        a verbal commitment, the process of negotiating with
                        potential partner nations can begin. There is no
                        financial obligation until the founding members have
                        approved a negotiated deal.
                      </p>
                    </Collapse.Panel>
                    <Collapse.Panel
                      key={"4"}
                      header="What services are available on SHUUT?  "
                    >
                      <p>
                        We are currently in the process of identifying
                        interested founding members. When at least 100 have made
                        a verbal commitment, the process of negotiating with
                        potential partner nations can begin. There is no
                        financial obligation until the founding members have
                        approved a negotiated deal.
                      </p>
                    </Collapse.Panel>
                  </Collapse>
                </div>
                <h1 className="font-lota font-semibold text-primary">
                  Support
                </h1>
                <div className="border-b"></div>
                <ul className="mt-10 space-y-2.5">
                  <li className="">
                    <Link href={`/listings/${selectedBooking?.listing?.slug}`}>
                      <a className="">Go To Item</a>
                    </Link>
                  </li>
                  <li className="">
                    <Link href={"/contact-support"}>
                      <a className="">Contact Support</a>
                    </Link>
                  </li>
                  <li className="">
                    <Link href={"/item"}>
                      <a className="">Change Date</a>
                    </Link>
                  </li>
                  <li className="">
                    <Link href={"/item"}>
                      <a className="text-[#EB001B]">Cancel</a>
                    </Link>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailView;
