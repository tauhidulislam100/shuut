import { Avatar, Carousel, notification, Popover, Spin, Tabs } from "antd";
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
import {
  IoIosAdd,
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosClose,
} from "react-icons/io";
import { FaTelegramPlane } from "react-icons/fa";
import { TbMail } from "react-icons/tb";
import {
  DatePicker,
  Modal,
  NavBar,
  RattingBar,
  SingleProduct,
} from "../../components";
import { Niger } from "../../components/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  ADD_TO_CART,
  CHECK_AVAILABILITY_QUERY,
  GetListingDetailsBySlug,
} from "../../graphql/query_mutations";
import { useRouter } from "next/router";
import useAsyncEffect from "use-async-effect";
import { formatMoney } from "../../utils/utils";
import { Map, Marker } from "../../components/map/MapView";
import { DateRange } from "react-day-picker";
import { differenceInDays, differenceInMonths, format } from "date-fns";
import { useAuth } from "../../hooks/useAuth";

const { TabPane } = Tabs;

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

const PricingTab = ({
  title = "",
  price = "",
  pricingType = "",
  onClick,
}: {
  title?: string;
  price?: string;
  pricingType?: string;
  onClick?: () => void;
}) => {
  return (
    <>
      <div className="flex items-center">
        <p className="inline-flex items-center text-lg font-sofia-pro text-secondary">
          <span>
            <Niger />
          </span>
          {formatMoney(price)}/{pricingType}
        </p>
        <p className="text-lg font-sofia-pro text-secondary mx-2">-</p>
        <p className="inline-flex items-center text-lg font-sofia-pro text-secondary">
          <span>
            <Niger />
          </span>{" "}
          {formatMoney(price)}
        </p>
      </div>
      <p className="text-sm my-5 text-primary-100 text-opacity-90">
        We’ve analysed prices for {title} from all renters on SHUUT.
      </p>
      <p className="text-sm text-primary-100 text-opacity-90">
        The advert price is above average.
      </p>
      <div className="mt-6 flex justify-center">
        <button
          onClick={onClick}
          className="font-sofia-pro px-7 bg-secondary rounded-md text-white h-8 inline-flex items-center text-sm font-medium"
        >
          Check Availabilty
        </button>
      </div>
    </>
  );
};

interface Billing {
  totalDays?: number;
  totalDiscount?: number;
  totalAmount?: number;
  totalServiceCharge?: number;
}
const ProductView = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [getListingBySlug, { data, loading }] = useLazyQuery(
    GetListingDetailsBySlug
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
          variables: { slug },
        });
      }
      setShowBookingInfoCard(false);
      setSelectedDate(undefined);
      setQuantity(1);
      setBilling({});
    },
    [router]
  );

  useEffect(() => {
    if (data) {
      setListing(data.listing?.[0]);
      setSelectedImage(data.listing?.[0]?.images?.[0].url);
    }
  }, [data]);

  useEffect(() => {
    if (selectedDate?.from && selectedDate?.to && listing) {
      const days = differenceInDays(selectedDate.to, selectedDate.from);
      const charge = process.env
        .NEXT_PUBLIC_SERIVCE_CHARGE as unknown as number;
      let totalAmount = 0;
      let totalCharge = 0;
      let totalDiscount = 0;
      if (days < 7 && days >= 1) {
        totalAmount = listing.daily_price * days;
        totalCharge = totalAmount * charge;
        totalAmount += totalCharge;
      } else if (days >= 7 && days < 30) {
        totalAmount = (listing.weekly_price / 7) * days;
        totalCharge = totalAmount * charge;
        totalDiscount = listing.daily_price * days - totalAmount;
        totalAmount += totalCharge;
      } else if (days >= 30) {
        totalAmount = (listing.monthly_price / 30) * days;
        totalCharge = totalAmount * charge;
        totalDiscount = listing.daily_price * days - totalAmount;
        totalAmount += totalCharge;
      }
      setBilling({
        totalDays: days,
        totalAmount,
        totalServiceCharge: totalCharge,
        totalDiscount,
      });
    }
  }, [selectedDate, listing]);

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
        startdate: format(selectedDate?.from, "yyyy-MM-dd"),
        enddate: format(selectedDate?.to, "yyyy-MM-dd"),
      },
    });
  };

  const onAvailabilityCheckComplete = (data: any) => {
    if (data?.result[0]?.available) {
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
      },
    });
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen">
      <div className="container">
        <NavBar />
      </div>
      <Modal
        onCancel={() => setShowAvailabilityCalendar(false)}
        visible={showAvailabilityCalendar}
        width={750}
      >
        <div className="w-full flex justify-center items-center px-10 pt-10">
          <div className="shadow rounded-lg px-5">
            <DatePicker selected={selectedDate} onChange={setSelectedDate} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-5 py-2">
          <button
            onClick={() => {
              setShowAvailabilityCalendar(false);
              setShowBookingInfoCard(false);
              setSelectedDate(undefined);
            }}
            className="w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold"
          >
            Cancel
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
              <div className="md:grid grid-cols-3 gap-8 mt-14 place-items-start">
                <div className="col-span-2 w-full">
                  <div className="flex gap-x-8 h-[660px] py-6 relative">
                    <button
                      onClick={goUp}
                      className="absolute top-0 left-[14%] z-10 text-primary text-opacity-40 text-xl"
                    >
                      <IoIosArrowUp />
                    </button>
                    <button
                      onClick={goDown}
                      className="absolute bottom-0 left-[13%] z-20 text-primary text-opacity-40 text-xl"
                    >
                      <IoIosArrowDown />
                    </button>

                    <div className="w-[30%] relative overflow-hidden">
                      <Carousel
                        ref={carouselRef}
                        className="product-carousel"
                        vertical={true}
                        slidesToShow={3.5}
                        infinite={false}
                        arrows={false}
                        dots={false}
                      >
                        {listing?.images?.map((image: any, index: number) => (
                          <div
                            key={image.id}
                            onClick={() => preview(index, image.url)}
                            className="w-full bg-white  rounded-sm p-[2px] overflow-hidden"
                          >
                            <img
                              className="w-full object-cover h-[143px] rounded-sm"
                              src={image.url}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </div>
                    <div className="w-[70%] bg-white p-8 rounded-md box-border">
                      <div className="box-border border border-[#F4F4F4] rounded-md px-4 py-10 h-[550px]">
                        <img
                          src={selectedImage}
                          className="max-w-full object-cover h-full w-full rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-10">
                    <h4 className="text-xl font-medium font-sofia-pro text-primary-100 mb-4">
                      Map Location
                    </h4>
                    {/* <img
                      src="/images/map-1.png"
                      className="w-full h-[293px] object-cover rounded-md"
                    /> */}
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
                <div className="col-span-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-primary-100 font-sofia-pro text-xl">
                      {listing?.title}
                    </h3>
                    <div className="inline-flex items-center bg-white rounded-md px-2 w-20 justify-between">
                      <button
                        className="text-xl"
                        onClick={() => setQuantity((p) => p + 1)}
                      >
                        <IoIosAdd />
                      </button>
                      <input
                        className="focus:outline-none py-2 w-[10px] text-center text-black font-medium font-sofia-pro"
                        placeholder={"" + quantity}
                      />
                      <button
                        className="text-xl"
                        onClick={() => setQuantity((p) => (p > 1 ? p - 1 : p))}
                      >
                        <BiMinus />
                      </button>
                    </div>
                  </div>
                  <Popover
                    visible={visibleHelpPopup}
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
                        <div className="px-6 py-5 text-[#0A2429E5] space-y-2.5">
                          <div className="flex justify-between">
                            <h4 className="font-sofia-pro text-[#0A2429] text-xl font-medium">
                              {differenceInDays(
                                selectedDate?.to as Date,
                                selectedDate?.from as Date
                              )}{" "}
                              Days
                            </h4>
                            <button
                              onClick={() => setShowAvailabilityCalendar(true)}
                              className="font-sofia-pro text-sm text-[#286EE6] "
                            >
                              Change
                            </button>
                          </div>
                          <div className="flex justify-between">
                            <h4 className="">
                              {format(selectedDate?.from as Date, "dd LLLL")}
                            </h4>
                            <div className="">-</div>
                            <h5 className="">
                              {format(selectedDate?.to as Date, "dd LLLL")}
                            </h5>
                          </div>
                          <div className="flex justify-between">
                            <h4 className="">Total Cost Per Day</h4>
                            <h5 className="">₦{listing?.daily_price}</h5>
                          </div>
                          <div className="flex justify-between">
                            <h4 className="">Service Fee</h4>
                            <h5 className="">₦{billing.totalServiceCharge}</h5>
                          </div>
                          {billing &&
                          billing.totalDiscount &&
                          (billing.totalDays as unknown as number) < 30 ? (
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
                            (billing.totalDays as unknown as number) >= 30 ? (
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
                            <h5 className="">₦{billing.totalAmount}</h5>
                          </div>
                          <div className="mt-6 flex justify-end gap-5">
                            {addedToCart ? (
                              <button
                                onClick={() => router.push("/listings/search")}
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
                                  "Add Cart"
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
                          <p className="text-[#EB001B]">
                            48 hours cooling off period
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-md p-6 mb-4 relative min-h-[255px]">
                        <h3 className="font-medium text-xl">
                          {listing?.title}
                        </h3>
                        <div className="grid grid-cols-3 gap-4 mt-5">
                          <div className="border border-[#DFDFE6] p-4 rounded-[5px]">
                            <h3 className="text-base font-semibold font-sofia-pro text-[#23262F]">
                              Monthly
                            </h3>
                            <p className="text-xs text-[#677489] font-medium font-sofia-pro">
                              ₦{listing?.monthly_price}/30days
                            </p>
                          </div>
                          <div className="border border-[#DFDFE6] p-4 rounded-[5px]">
                            <h3 className="text-base font-semibold font-sofia-pro text-[#23262F]">
                              Weekly
                            </h3>
                            <p className="text-xs text-[#677489] font-medium font-sofia-pro">
                              ₦{listing?.weekly_price}/7days
                            </p>
                          </div>
                          <div className="border border-[#DFDFE6] p-4 rounded-[5px]">
                            <h3 className="text-base font-semibold font-sofia-pro text-[#23262F]">
                              Daily
                            </h3>
                            <p className="text-xs text-[#677489] font-medium font-sofia-pro">
                              ₦{listing?.daily_price}/day
                            </p>
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

                    {/* <button className="absolute top-3 right-3 rounded-full w-6 h-6 inline-grid place-items-center border border-[#F4F4F4]">
                      <IoIosClose />
                    </button> */}
                    {/* <Tabs
                        className="price-tabs"
                        onChange={(k) => {
                          if (!cookie.get("__pop__")) {
                            setVisibleHelpPopup(true);
                          }
                        }}
                      >
                        <TabPane key="1" tab="Monthly Price">
                          <PricingTab
                            title={listing?.title}
                            price={listing?.monthly_price}
                            pricingType="month"
                            onClick={() => setAvailability(true)}
                          />
                        </TabPane>
                        <TabPane key="2" tab="Weekly Price">
                          <PricingTab
                            title={listing?.title}
                            price={listing?.weekly_price}
                            pricingType="week"
                            onClick={() => setAvailability(true)}
                          />
                        </TabPane>
                        <TabPane key="3" tab="Daily Price">
                          <PricingTab
                            title={listing?.title}
                            price={listing?.daily_price}
                            pricingType="day"
                            onClick={() => setAvailability(true)}
                          />
                        </TabPane>
                      </Tabs> */}
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
                    <Avatar size={68} />
                    <div className="ml-4 w-[75%]">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl text-primary-100 font-lota">
                          {listing?.user?.firstName}
                        </h4>
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
                    <div className="bg-white rounded-md p-4 pb-8 h-[293px]">
                      <div className="flex mb-5">
                        <Avatar size={41} />
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
                        <Avatar size={41} />
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

              <div className="mt-8 md:grid grid-cols-3 gap-8">
                <div className="col-span-2 rounded-md overflow-hidden">
                  {/* Listings owener and other */}
                </div>
                {/* <div className="col-span-1">
                  <div className="mt-5 md:mt-0 flex items-center justify-between mb-4">
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
                  <div className="bg-white rounded-md p-4 pb-8 h-[293px]">
                    <div className="flex mb-5">
                      <Avatar size={41} />
                      <div className="ml-3 w-[90%]">
                        <h4 className="text-[15px] font-sofia-pro text-primary-100 flex items-center justify-between">
                          Jane Doe
                          <span>05 August 2022</span>
                        </h4>
                        <RattingBar ratting={4.5} className="!text-[#FFCB45]" />
                        <p className="text-sm font-sofia-pro text-primary-100 mt-4">
                          05 August 2022 We’ve analysed prices for Video
                          CameraR.... from all renters on SHUUT.
                        </p>
                      </div>
                    </div> */}
                {/* <div className="flex">
                      <Avatar size={41} />
                      <div className="ml-3 w-[90%]">
                        <h4 className="text-[15px] font-sofia-pro text-primary-100">
                          Jane Doe
                        </h4>
                        <RattingBar ratting={4.5} className="!text-[#FFCB45]" />
                        <p className="text-sm font-sofia-pro text-primary-100 mt-4">
                          05 August 2022 We’ve analysed prices for Video
                          CameraR.... from all renters on SHUUT.
                        </p>
                      </div>
                    </div>
                  </div> */}
                {/* </div> */}
              </div>
            </div>
          </section>

          <section className="mb-14">
            <div className="container">
              <h4 className="text-xl font-medium font-sofia-pro text-primary-100 mb-4">
                Other Listing From Owner
              </h4>
              <div className="space-y-5 sm:space-y-0 sm:grid grid-cols-3 lg:grid-cols-5 gap-5">
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
              <div className="space-y-5 sm:space-y-0 sm:grid grid-cols-3 lg:grid-cols-5 gap-5">
                {listing?.category?.listings?.map((pd: any, idx: any) => (
                  <SingleProduct key={`product_index_${idx}`} data={pd} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ProductView;