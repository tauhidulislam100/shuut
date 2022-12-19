import {
  Avatar,
  Carousel,
  notification,
  Popover,
  Spin,
  Tabs,
  Grid,
} from "antd";
import { CarouselRef } from "antd/lib/carousel";
import React, { useEffect, useRef, useState } from "react";
import cookie from "js-cookie";
import {
  BsArrowLeftCircle,
  BsInstagram,
  BsTelephone,
  BsTwitter,
} from "react-icons/bs";
import { ImFacebook } from "react-icons/im";
import { BiMinus } from "react-icons/bi";
import { IoIosAdd, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaCheckSquare, FaInfoCircle, FaTelegramPlane } from "react-icons/fa";
import { TbMail } from "react-icons/tb";
import {
  DatePicker,
  Footer,
  Modal,
  NavBar,
  RattingBar,
  SingleProduct,
} from "../../components";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  ADD_TO_CART,
  CHECK_AVAILABILITY_QUERY,
  GetListingDetailsBySlug,
} from "../../graphql/query_mutations";
import { useRouter } from "next/router";
import useAsyncEffect from "use-async-effect";
import { checkDateOverlaps, roundBy } from "../../utils/utils";
import { Map, Marker } from "../../components/map/MapView";
import { DateRange, Matcher } from "react-day-picker";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import Link from "next/link";

const { useBreakpoint } = Grid;

const PopoverContent = ({ onSubmit }: { onSubmit?: () => void }) => (
  <div className="max-w-[350px] p-4 pt-8">
    <h4 className="text-lota font-[15px] text-white">Saftey Tips</h4>
    <ul className="list-disc text-xs text-white font-normal font-sofia-pro mt-3 ml-5">
      <li>Please ask for availabilyt before booking</li>
      <li>Be sure to read the instructions carefully</li>
      <li>Late return over 24hrs will be charged as perday.</li>
      <li>
        Inspect what you’re going to buy to make sure it is what you need.
      </li>
    </ul>
    <button
      onClick={onSubmit}
      className="ml-auto flex w-[77px] h-8 rounded-md text-primary items-center justify-center bg-white mt-4"
    >
      Got it
    </button>
  </div>
);

interface Billing {
  totalDays?: number;
  totalDiscount?: number;
  totalAmount?: number;
  totalServiceCharge?: number;
}
const ProductView = () => {
  const router = useRouter();
  const screen = useBreakpoint();
  const { isAuthenticated } = useAuth();
  const { SERVICE_CHARGE } = useGlobalState();
  const [getListingBySlug, { data, loading }] = useLazyQuery(
    GetListingDetailsBySlug,
    {
      nextFetchPolicy: "cache-and-network",
    }
  );
  const [addToCart, { loading: cartInProgress }] = useMutation(ADD_TO_CART, {
    onError: (error) => {
      notification.error({
        message: error.message,
      });
    },
    onCompleted: (data) => {
      setAddedToCart(true);
      notification.success({
        message: "Product added to cart successfully",
        placement: "bottom",
      });
    },
  });
  const [checkAvailability, { loading: checkInProgress }] = useLazyQuery(
    CHECK_AVAILABILITY_QUERY,
    {
      onCompleted: (data) => onAvailabilityCheckComplete(data),
      onError(error) {
        notification.error({
          message: error.message,
        });
      },
    }
  );
  const [visibleHelpPopup, setVisibleHelpPopup] = useState(false);
  const [billing, setBilling] = useState<Billing>({});
  const carouselRef = useRef<CarouselRef>(null);
  const [showAvailabilityCalendar, setShowAvailabilityCalendar] =
    useState(false);
  const [selectedImage, setSelectedImage] = useState<string>();
  const [listing, setListing] = useState<Record<string, any>>();
  const [expanded, setExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateRange>();
  const [showBookingInfoCard, setShowBookingInfoCard] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [disabledDays, setDisabledDays] = useState<Matcher | Matcher[]>([]);
  const [priceOption, setPriceOption] = useState<
    "weekly" | "monthly" | "daily"
  >("weekly");

  const goUp = () => {
    carouselRef.current?.next();
  };

  const goDown = () => {
    carouselRef.current?.prev();
  };

  const preview = (index = 1, image = "/images/product-1.png") => {
    carouselRef.current?.goTo(index);
    setSelectedImage(image);
  };

  useAsyncEffect(
    async (isMounted) => {
      if (isMounted() && router) {
        const { slug } = router.query;
        await getListingBySlug({
          variables: {
            slug,
            currentDate: format(new Date(), "yyyy-MM-dd"),
          },
        });
      }
      setShowBookingInfoCard(false);
      setSelectedDate(undefined);
      setQuantity(1);
      setBilling({});
      setPriceOption("weekly");
    },
    [router]
  );

  useEffect(() => {
    if (data) {
      const l = data.listing?.[0];
      setListing(l);
      setSelectedImage(l?.images?.[0].url);
      const blockedDays: any = [{ before: new Date() }];
      const filterRedBooking: any = {};

      for (const item of l.bookings ?? []) {
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
          console.log(overlapsed[i]);
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
        if (overlapsed[k].quantity < l.quantity) {
          delete overlapsed[k];
        }
      }
      // console.log("overlapsed: ", overlapsed);

      if (l?.availability_exceptions) {
        if (Array.isArray(l?.availability_exceptions)) {
          for (let item of l?.availability_exceptions) {
            blockedDays.push({
              from: new Date(item.from),
              to: new Date(item.to),
            });
          }
        } else {
          blockedDays.push({
            from: new Date(l?.availability_exceptions.from),
            to: new Date(l?.availability_exceptions.to),
          });
        }
      }

      setDisabledDays([...blockedDays, ...overlapsed]);
    }
  }, [data]);

  useEffect(() => {
    if (selectedDate?.from && selectedDate?.to && listing) {
      const days = differenceInCalendarDays(selectedDate.to, selectedDate.from);
      let totalAmount = 0;
      let totalCharge = 0;
      let totalDiscount = 0;
      if (days < 7 && days >= 1) {
        totalAmount = listing.daily_price * days;
        totalCharge = totalAmount * SERVICE_CHARGE;
        // totalAmount += totalCharge;
      } else if (days >= 7 && days < 30) {
        totalAmount = (listing.weekly_price / 7) * days;
        totalCharge = totalAmount * SERVICE_CHARGE;
        totalDiscount = listing.daily_price * days - totalAmount;
        // totalAmount += totalCharge;
      } else if (days >= 30) {
        totalAmount = (listing.monthly_price / 30) * days;
        totalCharge = totalAmount * SERVICE_CHARGE;
        totalDiscount = listing.daily_price * days - totalAmount;
        // totalAmount += totalCharge;
      }
      setBilling({
        totalDays: days,
        totalAmount,
        totalServiceCharge: totalCharge,
        totalDiscount,
      });
    }
  }, [selectedDate, listing, SERVICE_CHARGE]);

  const onCheckAvailability = async () => {
    setShowBookingInfoCard(false);
    if (!selectedDate?.from || !selectedDate?.to) {
      notification.warn({
        message: "please select a date range",
      });
      return;
    }

    await checkAvailability({
      variables: {
        listing_id: listing?.id,
        start: format(selectedDate?.from, "yyyy-MM-dd"),
        end: format(selectedDate?.to, "yyyy-MM-dd"),
        quantity,
      },
    });
  };

  const onAvailabilityCheckComplete = (data: any) => {
    if (data?.result?.available) {
      setShowAvailabilityCalendar(false);
      setShowBookingInfoCard(true);
    } else {
      notification.error({
        message: "product is not available, please check another date",
      });
    }
  };

  const onAddToCart = async () => {
    setAddedToCart(false);
    if (!isAuthenticated) {
      return router.push({
        pathname: "/auth/login",
        query: {
          redirect: `/listings/${router.query.slug}`,
        },
      });
    }

    await addToCart({
      variables: {
        listing_id: listing?.id,
        quantity: quantity,
        start: format(selectedDate?.from as Date, "yyyy-MM-ddd"),
        end: format(selectedDate?.to as Date, "yyyy-MM-ddd"),
        pricing_option: priceOption,
      },
    });
  };

  const bookNow = () => {
    router.push({
      pathname: "/transaction-summary",
      query: {
        start: format(selectedDate?.from as Date, "yyyy-MM-ddd"),
        end: format(selectedDate?.to as Date, "yyyy-MM-ddd"),
        listingId: listing?.id,
        quantity,
        pricing_option: priceOption,
      },
    });
  };

  const onChangePriceOption = (option: "monthly" | "weekly" | "daily") => {
    setPriceOption(option);
    setSelectedDate(undefined);
  };

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
      (priceOption === "weekly" || priceOption === "monthly")
    ) {
      const days = differenceInCalendarDays(range.to, range.from);
      console.log("days: ", days);
      setSelectedDate({
        ...range,
        to: addDays(
          range.from,
          roundBy(days, priceOption === "monthly" ? 30 : 7)
        ),
      });
      return;
    }
    setSelectedDate(range);
  };

  console.log("screen ", screen);
  return (
    <>
      <div className="bg-[#F8F8F8] min-h-screen">
        <NavBar />
        <Modal
          onCancel={() => setShowAvailabilityCalendar(false)}
          open={showAvailabilityCalendar}
          width={750}
        >
          <div className="w-full flex justify-center items-center px-10 pt-10">
            <div className="shadow rounded-lg px-5">
              <DatePicker
                priceOption={priceOption}
                disabled={disabledDays}
                selected={selectedDate}
                onChange={onRangeChange}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-5 py-2">
            <button
              onClick={() => {
                setShowBookingInfoCard(false);
                setSelectedDate(undefined);
              }}
              className="px-8 font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold"
            >
              Clear
            </button>
            <button
              disabled={!selectedDate?.from || !selectedDate?.to}
              onClick={onCheckAvailability}
              className="w-[244px] purple-button font-sofia-pro bg-secondary hover:bg-primary disabled:bg-primary disabled:cursor-not-allowed rounded-md text-white h-12 items-center text-lg font-semibold"
            >
              {checkInProgress ? <Spin size="small" /> : "Submit"}
            </button>
          </div>
        </Modal>
        {loading ? (
          <div className="h-[80vh] w-screen flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <section className="border-t border-[#D0CFD8] border-opacity-30 pt-5 mb-14">
              <div className="container">
                <button
                  onClick={() => router.back()}
                  className="text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center"
                >
                  <span className="mr-2 text-secondary">
                    <BsArrowLeftCircle />
                  </span>
                  back
                </button>
                <div className="md:grid xl:grid-cols-3 grid-cols-2 xl:gap-8 gap-4  xl:mt-14 place-items-start">
                  <div className="xl:col-span-2 w-full">
                    <div className="flex gap-x-8 xl:h-[660px] py-6 relative">
                      <button
                        onClick={goUp}
                        className="absolute top-0 left-[14%] z-10 text-primary text-opacity-40 text-xl hidden xl:block"
                      >
                        <IoIosArrowUp />
                      </button>
                      <button
                        onClick={goDown}
                        className="absolute bottom-0 left-[13%] z-20 text-primary text-opacity-40 text-xl hidden xl:block"
                      >
                        <IoIosArrowDown />
                      </button>

                      <div className="xl:w-[30%] w-full relative overflow-hidden">
                        <Carousel
                          ref={carouselRef}
                          className="product-carousel"
                          vertical={screen.xl}
                          slidesToShow={
                            screen.xl ? 3.5 : screen.md ? 1 : screen.sm ? 2 : 1
                          }
                          infinite={false}
                          arrows={false}
                          dots={!screen.xl}
                        >
                          {listing?.images?.map((image: any, index: number) => (
                            <div
                              key={image.id}
                              onClick={() => preview(index, image.url)}
                              className="w-full bg-white  rounded-sm p-[2px] overflow-hidden"
                            >
                              <img
                                className="w-full object-cover xl:h-[143px] h-full max-h-[320px] rounded-sm"
                                src={image.url}
                                alt="item image"
                              />
                            </div>
                          ))}
                        </Carousel>
                      </div>
                      <div className="w-[70%] bg-white p-8 rounded-md box-border xl:block hidden">
                        <div className="box-border border border-[#F4F4F4] rounded-md px-4 py-10 h-[550px]">
                          <img
                            src={selectedImage}
                            className="max-w-full object-cover h-full w-full rounded-md"
                            alt="selected image"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:mt-10 md:block hidden">
                      <h4 className="text-xl font-medium font-sofia-pro text-primary-100 mb-4">
                        Map Location
                      </h4>
                      <div className="w-full h-[293px]">
                        <Map
                          center={{ lat: listing?.lat, lng: listing?.lng }}
                          zoom={20}
                          style={{ flexGrow: "1", height: "100%" }}
                          scaleControl={false}
                          fullscreenControl={false}
                          mapTypeControl={false}
                          zoomControl={false}
                          rotateControl={false}
                          streetViewControl={false}
                        >
                          <Marker
                            position={{ lat: listing?.lat, lng: listing?.lng }}
                          />
                        </Map>
                      </div>
                    </div>
                  </div>
                  <div className="xl:col-span-1 w-full">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-primary-100 font-sofia-pro xl:text-xl lg:text-lg text-base hidden md:block">
                        {listing?.title}
                      </h3>
                      <div className="inline-flex items-center bg-white rounded-md px-2 w-20 justify-between ml-auto">
                        <button
                          className="text-xl"
                          onClick={() =>
                            setQuantity((p) => {
                              if (p < listing?.quantity) {
                                return p + 1;
                              }
                              return p;
                            })
                          }
                        >
                          <IoIosAdd />
                        </button>
                        <input
                          className="focus:outline-none py-2 w-[10px] text-center text-black font-medium font-sofia-pro"
                          placeholder={"" + quantity}
                        />
                        <button
                          className="text-xl"
                          onClick={() =>
                            setQuantity((p) => (p > 1 ? p - 1 : p))
                          }
                        >
                          <BiMinus />
                        </button>
                      </div>
                    </div>
                    <Popover
                      open={visibleHelpPopup}
                      content={
                        <PopoverContent
                          onSubmit={() => {
                            setVisibleHelpPopup(false);
                            cookie.set("__pop__", "1");
                          }}
                        />
                      }
                      placement="leftTop"
                      overlayClassName="price-popover"
                    >
                      {showBookingInfoCard &&
                      selectedDate?.from &&
                      selectedDate.to ? (
                        <div className="bg-white rounded-[5px] mb-5">
                          <div className="px-6 pt-5 text-[#0A2429E5] space-y-2.5">
                            <div className="flex justify-between">
                              <h4 className="font-sofia-pro text-[#0A2429] text-sm font-medium">
                                {billing.totalDays} Days
                                <span className="ml-2 inline-flex items-center">
                                  {format(selectedDate?.from as Date, "dd LLL")}
                                  <span className="mx-1">-</span>
                                  {format(selectedDate?.to as Date, "dd LLL")}
                                </span>
                              </h4>
                              <button
                                onClick={() =>
                                  setShowAvailabilityCalendar(true)
                                }
                                className="font-sofia-pro text-sm text-[#286EE6] "
                              >
                                Change
                              </button>
                            </div>
                            <div className="flex justify-between">
                              <h4 className="">
                                {priceOption === "weekly"
                                  ? (
                                      listing?.weekly_price /
                                      (billing?.totalDays as number)
                                    )?.toFixed(2)
                                  : priceOption === "monthly"
                                  ? (
                                      listing?.monthly_price /
                                      (billing?.totalDays as number)
                                    )?.toFixed(2)
                                  : listing?.daily_price}
                                <span className="mx-1">x</span>
                                {billing?.totalDays} days
                              </h4>
                              <h5 className="">₦{billing?.totalAmount}</h5>
                            </div>
                            <div className="flex justify-between">
                              <h4 className="">Service Fee</h4>
                              <h5 className="">
                                ₦{billing.totalServiceCharge?.toFixed(2)}
                              </h5>
                            </div>
                            {billing &&
                            billing.totalDiscount &&
                            priceOption === "weekly" ? (
                              <div className="flex justify-between">
                                <h4 className="text-green-500">
                                  Weekly price discount
                                </h4>
                                <h5 className="text-green-500">
                                  ₦{billing.totalDiscount}
                                </h5>
                              </div>
                            ) : billing &&
                              billing.totalDiscount &&
                              priceOption === "monthly" ? (
                              <div className="flex justify-between text-green-500">
                                <h4 className="text-green-500">
                                  Monthly price discount
                                </h4>
                                <h5 className="text-green-500">
                                  ₦{billing.totalDiscount}
                                </h5>
                              </div>
                            ) : null}
                            <div className="flex justify-between">
                              <h4 className="">Total</h4>
                              <h5 className="">
                                ₦
                                {(
                                  (billing.totalAmount as number) +
                                  (billing.totalServiceCharge as number)
                                )?.toFixed(2)}
                              </h5>
                            </div>
                            <div className="flex items-center text-xs font-sofia-pro font-normal text-[#0A2429E5] my-3">
                              <span className="text-[#286EE6] mr-2">
                                <FaInfoCircle />
                              </span>
                              Items are handed over to borrowers a day before
                              the first date booked and handed in (returned) the
                              day after the last date booked
                            </div>
                            <div className="mt-6 flex justify-end gap-5">
                              {addedToCart ? (
                                <button
                                  onClick={() =>
                                    router.push("/listings/search")
                                  }
                                  className="w-[133px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-8 items-center text-sm font-medium"
                                >
                                  Add More
                                </button>
                              ) : (
                                <button
                                  onClick={onAddToCart}
                                  className="w-[133px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-8 items-center text-sm font-medium"
                                >
                                  {cartInProgress ? (
                                    <Spin size="small" />
                                  ) : (
                                    "Add to Cart"
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (addedToCart) {
                                    router.push("/cart");
                                  } else {
                                    bookNow();
                                  }
                                }}
                                className="w-[133px] font-sofia-pro bg-secondary rounded-md text-white h-8 items-center text-sm font-medium"
                              >
                                {addedToCart ? "View Cart" : "Book Now"}
                              </button>
                            </div>
                            <a
                              href="#"
                              className="text-[#EB001B] mt-5 inline-block"
                            >
                              48 hours cooling off period
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-md lg:p-6 p-2 mb-4 relative min-h-[255px]">
                          <h3 className="font-medium xl:text-xl lg:text-lg text-base">
                            {listing?.title}
                          </h3>
                          <div className="grid grid-cols-3 sm:gap-4 gap-2 mt-5">
                            <div
                              onClick={() => onChangePriceOption("monthly")}
                              className={`border relative p-4 px-2 lg:px-4 rounded-[5px] hover:border-green-500 cursor-pointer ${
                                priceOption === "monthly"
                                  ? "border-green-500"
                                  : "border-[#DFDFE6]"
                              }`}
                            >
                              <h3 className="text-base font-semibold font-sofia-pro text-[#23262F]">
                                Monthly
                              </h3>
                              <p className="text-xs text-[#677489] font-medium font-sofia-pro">
                                ₦{listing?.monthly_price}/30days
                              </p>
                              {priceOption === "monthly" ? (
                                <span className="absolute top-2 right-2 text-green-500">
                                  <FaCheckSquare />
                                </span>
                              ) : null}
                            </div>
                            <div
                              onClick={() => onChangePriceOption("weekly")}
                              className={`border relative p-4 rounded-[5px] hover:border-green-500 cursor-pointer ${
                                priceOption === "weekly"
                                  ? "border-green-500"
                                  : "border-[#DFDFE6]"
                              }`}
                            >
                              <h3 className="text-base font-semibold font-sofia-pro text-[#23262F]">
                                Weekly
                              </h3>
                              <p className="text-xs text-[#677489] font-medium font-sofia-pro">
                                ₦{listing?.weekly_price}/7days
                              </p>
                              {priceOption === "weekly" ? (
                                <span className="absolute top-2 right-2 text-green-500">
                                  <FaCheckSquare />
                                </span>
                              ) : null}
                            </div>
                            <div
                              onClick={() => onChangePriceOption("daily")}
                              className={`border relative p-4 rounded-[5px] hover:border-green-500 cursor-pointer ${
                                priceOption === "daily"
                                  ? "border-green-500"
                                  : "border-[#DFDFE6]"
                              }`}
                            >
                              <h3 className="text-base font-semibold font-sofia-pro text-[#23262F]">
                                Daily
                              </h3>
                              <p className="text-xs text-[#677489] font-medium font-sofia-pro">
                                ₦{listing?.daily_price}/day
                              </p>
                              {priceOption === "daily" ? (
                                <span className="absolute top-2 right-2 text-green-500">
                                  <FaCheckSquare />
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <div className="mt-12 flex justify-center">
                            <button
                              onClick={() => setShowAvailabilityCalendar(true)}
                              className="font-sofia-pro px-7 bg-secondary rounded-md text-white h-8 inline-flex items-center text-sm font-medium"
                            >
                              Check Availabilty
                            </button>
                          </div>
                        </div>
                      )}
                    </Popover>
                    {/** this part will be enable later when availability check implemented, please do not remove this commented code if you want to modify you can */}

                    <div className="bg-white rounded-md p-4 mb-4">
                      <h3 className="text-xl text-primary-100 font-medium font-sofia-pro mb-6">
                        description
                      </h3>
                      <p className="text-sm text-primary-100 text-opacity-90">
                        {expanded
                          ? listing?.description
                          : listing?.description?.substring(0, 140)}

                        {listing?.description?.length > 140 ? (
                          <span
                            onClick={() => setExpanded(!expanded)}
                            className="cursor-pointer font-bold ml-2 text-blue-500"
                          >
                            {expanded ? "show less" : "show more"}
                          </span>
                        ) : null}
                      </p>
                    </div>
                    <div className="bg-white rounded-md p-4  h-[98px] flex">
                      <Avatar size={screen.xs ? 48 : 68} />
                      <div className="ml-4 w-[75%]">
                        <div className="flex items-center justify-between">
                          <Link href={`/profile/${listing?.user?.id}`}>
                            <a>
                              <h4 className="text-xl text-primary-100 font-lota">
                                {listing?.user?.firstName}
                              </h4>
                            </a>
                          </Link>
                          <div className="flex items-center">
                            <RattingBar
                              ratting={4.5}
                              className="text-[#FFCB45]"
                            />
                            <h3 className="ml-[2px] text-[#286EE6] text-sm font-normal font-sofia-pro">
                              17 Reviews
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <a
                            href="#"
                            className="inline-grid place-items-center w-[25px] h-[25px] rounded-full social-bg-gradient text-white text-sm"
                          >
                            <ImFacebook />
                          </a>
                          <a
                            href="#"
                            className="inline-grid place-items-center w-[25px] h-[25px] rounded-full social-bg-gradient text-white text-sm"
                          >
                            <BsInstagram />
                          </a>
                          <a
                            href="#"
                            className="inline-grid place-items-center w-[25px] h-[25px] rounded-full social-bg-gradient text-white text-sm"
                          >
                            <FaTelegramPlane />
                          </a>
                          <a
                            href="#"
                            className="inline-grid place-items-center w-[25px] h-[25px] rounded-full social-bg-gradient text-white text-sm"
                          >
                            <BsTwitter />
                          </a>
                          <a
                            href="#"
                            className="inline-grid place-items-center w-[25px] h-[25px] rounded-full social-bg-gradient text-white text-sm"
                          >
                            <TbMail />
                          </a>
                          <a
                            href="#"
                            className="inline-grid place-items-center w-[25px] h-[25px] rounded-full social-bg-gradient text-white text-sm"
                          >
                            <BsTelephone />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white mt-4">
                      <div className="p-4 md:mt-0 flex items-center justify-between mb-4">
                        <h4 className="text-xl font-medium font-sofia-pro text-primary-100">
                          Reviews
                        </h4>
                        <a
                          href="#"
                          className="text-sm text-[#286EE6] font-normal font-sofia-pro"
                        >
                          See All
                        </a>
                      </div>
                      <div className="bg-white rounded-md p-4 pb-8 md:h-[293px]">
                        <div className="flex mb-5">
                          <Avatar size={screen.xs ? 32 : 41} />
                          <div className="ml-3 w-[90%]">
                            <h4 className="text-[15px] font-sofia-pro text-primary-100 flex items-center justify-between">
                              Jane Doe
                              <span>05 August 2022</span>
                            </h4>
                            <RattingBar
                              ratting={4.5}
                              className="!text-[#FFCB45]"
                            />
                            <p className="text-sm font-sofia-pro text-primary-100 mt-4">
                              05 August 2022 We’ve analysed prices for Video
                              CameraR.... from all renters on SHUUT.
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          <Avatar size={screen.xs ? 32 : 41} />
                          <div className="ml-3 w-[90%]">
                            <h4 className="text-[15px] font-sofia-pro text-primary-100">
                              Jane Doe
                            </h4>
                            <RattingBar
                              ratting={4.5}
                              className="!text-[#FFCB45]"
                            />
                            <p className="text-sm font-sofia-pro text-primary-100 mt-4">
                              05 August 2022 We’ve analysed prices for Video
                              CameraR.... from all renters on SHUUT.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full mt-10 md:hidden">
                  <h4 className="text-xl font-medium font-sofia-pro text-primary-100 mb-4">
                    Map Location
                  </h4>
                  <div className="w-full h-[293px]">
                    <Map
                      center={{ lat: listing?.lat, lng: listing?.lng }}
                      zoom={20}
                      style={{ flexGrow: "1", height: "100%" }}
                      scaleControl={false}
                      fullscreenControl={false}
                      mapTypeControl={false}
                      zoomControl={false}
                      rotateControl={false}
                      streetViewControl={false}
                    >
                      <Marker
                        position={{ lat: listing?.lat, lng: listing?.lng }}
                      />
                    </Map>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-14">
              <div className="container">
                <h4 className="text-xl font-medium font-sofia-pro text-primary-100 mb-4">
                  Other Listing From Owner
                </h4>
                <div className="space-y-5 sm:space-y-0 sm:grid grid-cols-3 lg:grid-cols-4 md:grid-cols-2  gap-5">
                  {listing?.user?.listings?.map((pd: any, idx: any) => (
                    <SingleProduct
                      key={`product_index_${idx}`}
                      data={{ ...pd, user: listing.user }}
                    />
                  ))}
                </div>
              </div>
            </section>
            <section className="pb-14">
              <div className="container">
                <h4 className="text-xl font-medium font-sofia-pro text-primary-100 mb-4">
                  Other Listing From {listing?.category?.name}
                </h4>
                <div className="space-y-5 sm:space-y-0 sm:grid grid-cols-3 lg:grid-cols-4 md:grid-cols-2 gap-5">
                  {listing?.category?.listings?.map((pd: any, idx: any) => (
                    <SingleProduct key={`product_index_${idx}`} data={pd} />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductView;
