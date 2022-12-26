import { useMutation } from "@apollo/client";
import { Avatar, Collapse, notification, Spin } from "antd";
import {
  addDays,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  format,
} from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { DateRange, Matcher } from "react-day-picker";
import { BsPlus, BsX } from "react-icons/bs";
import {
  CANCEL_BOOKING,
  EXTEND_REQUEST,
  EXTENSION_PAYMENT,
} from "../../graphql/query_mutations";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import { PayButton } from "../../pages/transaction-summary";
import { checkDateOverlaps, roundBy, turnicate } from "../../utils/utils";
import DatePicker from "../DatePicker";

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
      <div className="flex justify-between xs:flex-row flex-col items-center xs:p-5">
        <div className="flex items-center xs:flex-row flex-col">
          <div className="relative">
            <img
              src={booking?.listing?.images?.[0]?.url}
              alt={booking?.listing?.title}
              className="xs:w-[166px] xs:h-[129px] w-full"
            />
          </div>
          <h5 className="text-primary-100 pl-4 text-base font-medium font-sofia-pro">
            {turnicate(booking?.listing?.title, 30)}
          </h5>
        </div>
        <div className="">
          <p className="text-primary-100/30">
            {format(new Date(booking?.start as string), "do MMM")} -{" "}
            {format(new Date(booking?.end as string), "do MMMM yyyy")}
          </p>
        </div>
      </div>
      <div className="flex xs:justify-end xs:mt-0 mt-3 px-5">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Avatar size={50} src={booking?.listing?.user?.profile_photo} />
          </div>
          <h4 className="text-primary-100/30">
            {booking?.listing.user?.firstName}{" "}
            {booking?.listing?.user?.lastName}
          </h4>
        </div>
      </div>
      <button className="bg-secondary text-white w-full hover:bg-primary py-2.5 text-sm font-sofia-pro mt-4">
        {booking.state === "PENDING"
          ? "Pending Availability Confirmation"
          : booking.state === "ACCEPTED"
          ? "Rented"
          : booking.state === "EXTEND"
          ? "Awaiting for Extension Approval"
          : booking.state}
      </button>
    </div>
  );
};

interface IProps {
  bookings: Record<string, any>[];
  activeItem?: Record<string, any>;
  activeFilter?: string;
  resetView?: (_f?: string) => void;
}

const RentalDetailView = ({
  bookings = [],
  activeItem,
  activeFilter,
  resetView,
}: IProps) => {
  const router = useRouter();
  const { SERVICE_CHARGE, SERVICE_VAT } = useGlobalState();
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<
    Record<string, any> | undefined
  >(activeItem);
  const [disabledDays, setDisabledDays] = useState<Matcher | Matcher[]>([]);
  const [selectedDate, setSelectedDate] = useState<DateRange>();
  const [extend, setExtend] = useState(false);
  const [extensionCost, setExtensionCost] = useState<number>(0);
  const [extendBooking, { loading }] = useMutation(EXTEND_REQUEST, {
    onError(error) {
      notification.error({
        message: error?.message,
      });
    },
    onCompleted() {
      notification.success({
        message: "An extension Request Has been sent",
      });
      resetView?.("request");
    },
  });
  const [extensionPayment, { loading: paymentLoading }] = useMutation(
    EXTENSION_PAYMENT,
    {
      onCompleted() {
        notification.success({
          message: "Extension Payment Success",
        });
        setExtend(false);
        setSelectedDate(undefined);
        setExtensionCost(0);
        resetView?.("request");
      },
      onError(error) {
        notification.error({
          message: error?.message,
        });
      },
    }
  );
  const [cancelBooking, { loading: cancelInprogress }] = useMutation(
    CANCEL_BOOKING,
    {
      onCompleted() {
        notification.success({
          message: "Booking Request Successfully Cancelled",
        });
        resetView?.("request");
      },
      onError(error) {
        notification.error({
          message: error.message ?? "Unable to cancel the booking",
        });
      },
    }
  );

  const isRented =
    activeFilter === "handin-today" ||
    activeFilter === "handin-tomorrow" ||
    activeFilter === "rented";

  useEffect(() => {
    if (selectedBooking?.listing?.bookings) {
      const blockedDays: any = [{ before: new Date() }];
      const filterRedBooking: any = {};

      for (const item of selectedBooking?.listing?.bookings ?? []) {
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
        if (overlapsed[k].quantity < selectedBooking.listing.quantity) {
          delete overlapsed[k];
        }
      }

      if (selectedBooking?.listing.availability_exceptions) {
        if (Array.isArray(selectedBooking?.listing.availability_exceptions)) {
          for (let item of selectedBooking?.listing.availability_exceptions) {
            blockedDays.push({
              from: new Date(item.from),
              to: new Date(item.to),
            });
          }
        } else {
          blockedDays.push({
            from: new Date(
              selectedBooking?.listing.availability_exceptions.from
            ),
            to: new Date(selectedBooking?.listing.availability_exceptions.to),
          });
        }
      }

      setDisabledDays([...blockedDays, ...overlapsed]);
      setSelectedDate({
        ...selectedDate,
        from: addDays(new Date(selectedBooking.end), 1),
      });
    }
  }, [selectedBooking]);

  const onRangeChange = (range: DateRange | undefined) => {
    if (
      range?.from &&
      range?.to &&
      range?.from?.toDateString() === range?.to?.toDateString()
    ) {
      return;
    }
    if (
      range?.from &&
      range.to &&
      (selectedBooking?.pricing_option === "weekly" ||
        selectedBooking?.pricing_option === "monthly")
    ) {
      const days = differenceInCalendarDays(range.to, range.from);
      setSelectedDate({
        from: selectedDate?.from,
        to: addDays(
          range.from,
          roundBy(days, selectedBooking?.pricing_option === "monthly" ? 30 : 7)
        ),
      });
      return;
    }
    setSelectedDate({ from: selectedDate?.from, to: range?.to });
  };

  useEffect(() => {
    if (selectedDate?.from && selectedDate.to) {
      switch (selectedBooking?.pricing_option) {
        case "weekly":
          const weeks = differenceInCalendarWeeks(
            selectedDate.to,
            selectedDate.from
          );
          setExtensionCost(weeks * selectedBooking.listing.weekly_price);
          break;
        case "monthly":
          const months = differenceInCalendarMonths(
            selectedDate.to,
            selectedDate.from
          );
          setExtensionCost(months * selectedBooking.listing.montly_price);
          break;
        case "daily":
          const days = differenceInCalendarDays(
            selectedDate.to,
            selectedDate.from
          );
          setExtensionCost(days * selectedBooking?.listing?.daily_price);
        default:
          break;
      }
    }
  }, [selectedDate, selectedBooking]);

  useEffect(() => {
    if (
      selectedBooking?.state === "EXTEND" ||
      (selectedBooking?.state === "EXTENDED" &&
        !selectedBooking?.is_extension_paid)
    ) {
      setSelectedDate({
        from: new Date(selectedBooking.extend_from),
        to: new Date(selectedBooking.extend_to),
      });
      setExtend(true);
    }
  }, [selectedBooking]);

  const onExtendRequest = async () => {
    extendBooking({
      variables: {
        booking_id: selectedBooking?.id,
        extend_from: format(selectedDate?.from as Date, "yyyy-MM-dd"),
        extend_to: format(selectedDate?.to as Date, "yyyy-MM-dd"),
      },
    });
  };

  const onPaymentSuccess = async (ref: any) => {
    const service_charge = extensionCost * Number(SERVICE_CHARGE);
    const vat = (extensionCost + service_charge) * Number(SERVICE_VAT);
    const amount = extensionCost + service_charge + vat;
    await extensionPayment({
      variables: {
        vat: selectedBooking?.vat + vat,
        service_charge: selectedBooking?.service_charge + service_charge,
        cost: selectedBooking?.cost + amount,
        booking_id: selectedBooking?.id,
        amount: amount,
        status: ref.status,
        reference: ref.reference,
        transaction_id: selectedBooking?.transaction_id,
      },
    });
  };

  const goToMessage = () => {
    router.push(
      {
        pathname: "/inbox",
        query: { userId: selectedBooking?.listing?.user?.id },
      },
      "inbox"
    );
  };
  return (
    <div className="font-lota">
      <h1 className="text-[32px] text-primary">
        {isRented ? "Approved" : "Rentals"}
      </h1>
      <div className="mt-5">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-10 items-start">
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
          <div>
            <div className="bg-[#F8F8F8] rounded-[5px] border p-5 xs:px-5 px-2">
              <div className="flex justify-between  items-center xs:flex-row flex-col">
                <div className="flex items-center xs:flex-row flex-col mb-3 xs:mb-0">
                  <div className="relative">
                    <img
                      alt={selectedBooking?.listing?.title}
                      src={selectedBooking?.listing?.images?.[0]?.url}
                      className="xs:w-[166px] xs:h-[129px]  w-full object-cover"
                    />
                  </div>
                  <h5 className="text-primary-100 mt-3 xs:pl-2 xs:mt-0 font-medium text-base font-sofia-pro">
                    {turnicate(selectedBooking?.listing?.title, 30)}
                  </h5>
                </div>
                <div className="">
                  <p className="text-primary-100 font-normal text-base font-sofia-pro">
                    {format(
                      new Date(selectedBooking?.start as string),
                      "do MMM"
                    )}{" "}
                    -{" "}
                    {format(
                      new Date(selectedBooking?.end as string),
                      "do MMMM yyyy"
                    )}
                  </p>
                </div>
              </div>
              <h2 className="mt-9 font-sofia-pro font-medium text-base text-primary-100">
                Owned by {selectedBooking?.listing?.user?.firstName}{" "}
                {selectedBooking?.listing?.user?.lastName}
              </h2>
              <div className="mt-2.5 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <Avatar
                      src={selectedBooking?.listing?.user?.profile_photo}
                      size={50}
                    />
                  </div>
                  <h4 className="text-primary-100/30">Answers fast</h4>
                </div>
                <div className="">
                  <button
                    onClick={goToMessage}
                    className="min-w-[155px] xxs:min-w-[140px] btn h-11 border border-secondary text-secondary"
                  >
                    Message {selectedBooking?.listing?.user?.firstName}
                  </button>
                  {(selectedBooking?.state === "ACCEPTED" ||
                    selectedBooking?.state === "EXTEND") &&
                  selectedBooking?.state !== "EXTENDED" ? (
                    <button
                      onClick={() => setExtend(true)}
                      className="ml-4 min-w-[155px] btn h-11 bg-secondary text-white hover:bg-primary"
                    >
                      {selectedBooking?.state === "EXTEND"
                        ? "Extension Requested"
                        : "Extend"}
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="border-b my-10"></div>
              {extend ? (
                selectedBooking?.state !== "EXTENDED" ? (
                  <div className="flex items-center justify-center mb-10">
                    <div className="bg-white inline-flex rounded-lg">
                      <DatePicker
                        priceOption={selectedBooking?.pricing_option}
                        disabled={disabledDays}
                        selected={selectedDate}
                        onChange={onRangeChange}
                      />
                    </div>
                  </div>
                ) : null
              ) : (
                <>
                  <div className="font-lota xs:px-5 px-2 text-sm">
                    <div className="flex justify-between items-center">
                      <h1 className="text-primary font-semibold">
                        Payment Information
                      </h1>
                      <h2 className="text-primary-100/30 underline">Invoice</h2>
                    </div>
                    <div className="flex justify-between items-center mt-12">
                      <p className="text-[#677489]">Cost of Service</p>
                      <p className="text-[#111729]">
                        ₦{selectedBooking?.cost?.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-4">
                      <p className="text-[#677489]">Total Rental Fee</p>
                      <p className="text-[#111729]">
                        ₦{selectedBooking?.service_charge?.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[#677489]">VAT</p>
                      <p className="text-[#111729]">
                        ₦{selectedBooking?.vat?.toFixed(2)}
                      </p>
                    </div>
                    <div className="border-b mt-5 mb-2.5"></div>
                    <div className="flex justify-between items-center">
                      <p className="text-[#111729] text-sm">Total</p>
                      <p className="text-secondary text-sm font-semibold">
                        ₦
                        {(
                          selectedBooking?.cost +
                          selectedBooking?.vat +
                          selectedBooking?.service_charge
                        )?.toFixed(2)}
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
                          interested founding members. When at least 100 have
                          made a verbal commitment, the process of negotiating
                          with potential partner nations can begin. There is no
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
                          interested founding members. When at least 100 have
                          made a verbal commitment, the process of negotiating
                          with potential partner nations can begin. There is no
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
                          interested founding members. When at least 100 have
                          made a verbal commitment, the process of negotiating
                          with potential partner nations can begin. There is no
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
                          interested founding members. When at least 100 have
                          made a verbal commitment, the process of negotiating
                          with potential partner nations can begin. There is no
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
                      <Link
                        href={`/listings/${selectedBooking?.listing?.slug}`}
                      >
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
                      <button
                        className="text-[#EB001B] bg-transparent border-0"
                        onClick={() =>
                          cancelBooking({
                            variables: { booking_id: selectedBooking?.id },
                          })
                        }
                      >
                        {cancelInprogress ? "Cancelling..." : "Cancel"}
                      </button>
                    </li>
                  </ul>
                </>
              )}
              {selectedDate?.from && selectedDate?.to ? (
                <div className="font-lota px-5 text-sm">
                  <h1 className="text-primary font-semibold">
                    Transaction Summary
                  </h1>
                  <div className="flex justify-between items-end mt-10">
                    <p className="text-[#677489]">
                      {differenceInCalendarDays(
                        selectedDate.to,
                        selectedDate.from
                      )}{" "}
                      Days of extension
                    </p>
                    <p className="text-[#111729]">
                      ₦{extensionCost?.toFixed(2)}
                    </p>
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
                      ₦{(extensionCost * Number(SERVICE_CHARGE))?.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[#677489]">VAT</p>
                    <p className="text-[#111729]">
                      ₦
                      {(
                        extensionCost * Number(SERVICE_CHARGE) +
                        extensionCost * Number(SERVICE_VAT)
                      )?.toFixed(2)}
                    </p>
                  </div>
                  <div className="border-b mt-5 mb-2.5"></div>
                  <div className="flex justify-between items-center">
                    <p className="text-[#111729] text-sm">Total</p>
                    <p className="text-secondary text-sm font-semibold">
                      ₦
                      {(
                        extensionCost +
                        extensionCost * Number(SERVICE_CHARGE) +
                        extensionCost * Number(SERVICE_VAT)
                      )?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="flex justify-end mt-4">
              {selectedDate?.from &&
              selectedDate.to &&
              selectedBooking?.state === "ACCEPTED" ? (
                <button
                  onClick={onExtendRequest}
                  className="ml-4 min-w-[155px] btn h-11 bg-secondary text-white hover:bg-primary purple-button"
                >
                  {loading ? <Spin size="small" /> : "Request"}
                </button>
              ) : null}

              {!selectedBooking?.is_extension_paid &&
              selectedBooking?.state === "EXTENDED" &&
              extend ? (
                <PayButton
                  email={user?.email as string}
                  amount={
                    extensionCost +
                    extensionCost * Number(SERVICE_CHARGE) +
                    extensionCost * Number(SERVICE_VAT)
                  }
                  loading={paymentLoading}
                  onSuccess={onPaymentSuccess}
                  onClose={() => {
                    console.log("payment cancelled");
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetailView;
