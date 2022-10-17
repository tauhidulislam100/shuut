import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import {
  DatePicker,
  MapView,
  NavBar,
  SingleProduct,
} from "../../../components";
import { topCities } from "../../../data";
import { BsArrowLeftCircle } from "react-icons/bs";
import { RiEqualizerLine } from "react-icons/ri";
import { BiCurrentLocation } from "react-icons/bi";
import {
  AutoComplete,
  Checkbox,
  Dropdown,
  notification,
  Radio,
  RadioChangeEvent,
  Spin,
} from "antd";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  GetAllCategoryQuery,
  SearchListingQuery,
} from "../../../graphql/query_mutations";
import { useRouter } from "next/router";
import useAsyncEffect from "use-async-effect";
import { DateRange } from "react-day-picker";
import { getPosition } from "../../../utils/utils";
import { useMediaQuery } from "react-responsive";
import { FaList, FaMapMarkerAlt } from "react-icons/fa";

type dropItems = {
  label: string;
  value: string;
};
type dropdownProps = {
  dropdownData: dropItems[];
  onSortingChange?: (e: RadioChangeEvent) => void;
  selectedValue?: string;
};

const sortingOptions = [
  {
    label: "Distance-Nearest First",
    value: "distance_nearest",
  },
  { label: "Relevance", value: "relevance" },
  { label: "Price (Cheapest First)", value: "price" },
];

const DropdownBody = ({
  dropdownData,
  selectedValue,
  onSortingChange,
}: dropdownProps) => {
  return (
    <Radio.Group
      value={selectedValue}
      className="bg-white shadow-lg rounded-lg"
    >
      {dropdownData.map((itm: dropItems, idx: number) => (
        <li
          key={`dropdown_${idx}_${itm.value}`}
          className="text-sm font-lota border-b-[1.5px] text-[#969696]"
        >
          <Radio
            value={itm.value}
            onChange={onSortingChange}
            className="text-[#969696] px-3.5 py-2.5"
          >
            {itm.label}
          </Radio>
        </li>
      ))}
    </Radio.Group>
  );
};

export const defaultRadius = 80000;

const ProductSearch = () => {
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });
  const router = useRouter();
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>(
    topCities[0]
  );
  const [searchListing, { loading, data }] = useLazyQuery(SearchListingQuery, {
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const { data: categoryList } = useQuery(GetAllCategoryQuery);
  const [zoom, setZoom] = React.useState(10); // initial zoom
  const [hovredItem, setHovredItem] = useState<google.maps.LatLngLiteral>();
  const [listingMarkers, setListingMarkers] = useState<
    { lat: number; lng: number; price: string }[]
  >([]);
  const [filterOption, setFilterOption] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>();
  const [selectedDataRange, setSelectedDateRange] = useState<DateRange>();
  const [isMapCenterChanged, setIsMapCenterChanged] = useState<boolean>(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedSorting, setSelectedSorting] = useState(
    sortingOptions[1].value
  );

  useEffect(() => {
    if (data && data.listings) {
      setListingMarkers(
        data.listings.map((listing: Record<string, any>) => ({
          lat: listing.lat,
          lng: listing.lng,
          price: listing.daily_price,
        }))
      );
    }
  }, [data]);

  useEffect(() => {
    const previousPosition = localStorage.getItem("__previous_location");
    if (previousPosition) {
      setCenter(JSON.parse(previousPosition));
    }
    const { query } = router.query;
    setSearchText(query as string);
  }, [router]);

  useAsyncEffect(
    async (isMounted) => {
      if (isMounted()) {
        console.log("searchText: ", searchText);
        if (
          searchText ||
          selectedCategoryName ||
          (selectedDataRange?.from && selectedDataRange?.to) ||
          selectedSorting
        ) {
          await searchListing({
            variables: {
              lat: center.lat,
              lng: center.lng,
              distance_in_meters: defaultRadius,
              queryText: selectedCategoryName ?? searchText,
              startdate:
                selectedDataRange?.from?.toISOString()?.split("T")[0] ??
                undefined,
              enddate:
                selectedDataRange?.to?.toISOString()?.split("T")[0] ??
                undefined,
              sortby: selectedSorting,
            },
          });
        } else if (!searchText && !selectedCategoryName) {
          await searchListing({
            variables: {
              lat: center.lat,
              lng: center.lng,
              distance_in_meters: defaultRadius,
              sortby: selectedSorting,
            },
          });
        }
      }
    },
    [center, selectedCategoryName, selectedDataRange, selectedSorting, router]
  );

  const onSearch = async () => {
    await searchListing({
      variables: {
        lat: center.lat,
        lng: center.lng,
        distance_in_meters: defaultRadius,
        queryText: searchText,
      },
    });
    // setSearchText("");
  };

  const onSearchByCategory = async (categoryName?: string) => {
    setFilterOption("");
    setSelectedCategoryName(categoryName as string);
    await searchListing({
      variables: {
        lat: center.lat,
        lng: center.lng,
        distance_in_meters: defaultRadius,
        queryText: categoryName,
      },
    });
  };

  const applyDateFilter = async () => {
    setFilterOption("");
    await searchListing({
      variables: {
        lat: center.lat,
        lng: center.lng,
        distance_in_meters: defaultRadius,
        startdate: selectedDataRange?.from?.toISOString()?.split("T")[0],
        enddate: selectedDataRange?.to?.toISOString()?.split("T")[0],
        queryText: selectedCategoryName || searchText,
        sortby: selectedSorting,
      },
    });
  };
  const clearDateFilter = () => {
    setFilterOption("");
    setSelectedDateRange(undefined);
  };

  const handleOnChanterChange = (map: google.maps.Map) => {
    // console.log("center of the map: ", map.getCenter()?.toJSON());
    // console.log("center changes?.");
    setIsMapCenterChanged(true);
  };

  const onIdle = (m: google.maps.Map) => {
    setZoom(m.getZoom()!);
    setCenter((p) => ({
      ...p,
      ...m.getCenter()!.toJSON(),
    }));
    localStorage.setItem(
      "__previous_location",
      JSON.stringify(m.getCenter()!.toJSON())
    );
  };

  const handleMouseOver = (latLng: { lat: number; lng: number }) => {
    setHovredItem(latLng);
  };

  const onLocationSelect = (location: Record<string, any>) => {
    setFilterOption("");
    setCenter(location as any);
    setIsMapCenterChanged(false);
  };

  const getCurrentLocation = async () => {
    try {
      const position = await getPosition();
      const m = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        city: "Current user location",
      };
      setCenter(m);
      setIsMapCenterChanged(false);
    } catch (error) {
      console.error("user permission denined");
    }
    setFilterOption("");
  };

  return (
    <>
      <NavBar />
      <div onClick={() => setShowMap(prev => !prev)} className="md:hidden z-[5000] fixed bottom-5 left-1/2 text-2xl text-primary">
        {
          showMap ?
          <FaList /> :
          <FaMapMarkerAlt />
        }
      </div>
      <div className="bg-[#FFFFFF] border-t border-[#D0CFD8] border-opacity-30 pt-4 pb-10">
        <div className="container">
          <div className="">
            <button
              onClick={() => router.back()}
              className="text-primary-100 font-normal font-sofia-pro text-xs capitalize flex items-center"
            >
              <span className="mr-2 text-secondary">
                <BsArrowLeftCircle />
              </span>
              back
            </button>
          </div>
          <div className="space-y-5 sm:space-y-0 sm:flex justify-between items-center">
            <div className="mt-5 flex items-center w-[430px] max-w-full border border-body-light rounded-lg p-[2px] relative">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="All Gears"
                className="md:min-w-max px-10 h-12 w-full focus:ring-0 focus:outline-none text-body-200 text-sm font-light"
              />
              <button
                onClick={() => onSearch()}
                className="px-7 h-12 bg-secondary text-white min-w-max rounded-r-lg"
              >
                Search
              </button>
              <span className="absolute top-4 left-4 text-lg text-[#263238]">
                <IoIosSearch />
              </span>
            </div>
            <div className="flex items-center gap-5 overflow-x-scroll sm:overflow-x-auto">
              <button
                onClick={() => {
                  if (selectedCategoryName) {
                    setSelectedCategoryName(undefined);
                  } else {
                    setFilterOption("category");
                  }
                }}
                className={`px-3 min-w-[121px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] hover:border-secondary rounded-md text-[#0A2429] hover:text-secondary h-12 items-center ${
                  filterOption === "category"
                }`}
              >
                {selectedCategoryName ? selectedCategoryName : "Category"}
              </button>
              <button
                onClick={() => setFilterOption("location")}
                className={`px-5 min-w-[121px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] hover:border-secondary rounded-md text-[#0A2429] hover:text-secondary h-12 items-center ${
                  filterOption === "location"
                }`}
              >
                {isMapCenterChanged
                  ? "Location Selected By Map"
                  : (center as any)?.city
                  ? (center as any)?.city
                  : "Location"}
              </button>
              <button
                onClick={() => {
                  if (selectedDataRange) {
                    clearDateFilter();
                  } else {
                    setFilterOption("date");
                  }
                }}
                className={`px-3 min-w-[121px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] hover:border-secondary rounded-md text-[#0A2429] hover:text-secondary h-12 items-center ${
                  filterOption === "date"
                }`}
              >
                {selectedDataRange ? (
                  <span>
                    {selectedDataRange?.from?.toLocaleDateString("default", {
                      month: "short",
                      day: "numeric",
                    })}
                    -
                    {selectedDataRange?.to?.toLocaleDateString("default", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                ) : (
                  "Date"
                )}
              </button>
              <Dropdown
                arrow
                trigger={["click"]}
                overlay={
                  <DropdownBody
                    dropdownData={sortingOptions}
                    selectedValue={selectedSorting}
                    onSortingChange={(e) => {
                      setSelectedSorting(e.target.value);
                    }}
                  />
                }
              >
                <button
                  onClick={() => setFilterOption("")}
                  className="text-[#0A2429] hover:text-secondary"
                >
                  <RiEqualizerLine className="text-3xl" />
                </button>
              </Dropdown>
            </div>
          </div>
          <div className="pt-5 max-h-[calc(100vh-250px)] h-[calc(100vh-250px)] md:h-[auto] md:max-h-[auto] overflow-y-scroll md:overflow-y-visible">
            <div className={`min-w-full w-full h-full ${showMap ? 'block md:hidden' : 'hidden'}`}>
                <MapView
                  markers={listingMarkers}
                  center={center}
                  zoom={zoom}
                  onIdle={onIdle}
                  onCenterChange={handleOnChanterChange}
                  focusedMarker={hovredItem}
                />
            </div>
            <div className={`${showMap ? 'hidden md:block' : 'block'}`}>
            {filterOption === "" && (
              <div className="space-y-5 md:grid grid-cols-3 gap-7 mt-10">
                {loading ? (
                  <div className="col-span-2 grid place-items-center">
                    <Spin size="large" />
                  </div>
                ) : (
                  <div className="col-span-2 sm:grid grid-cols-2 md:grid-cols-3 gap-5 items-start">
                    {data?.listings?.map((listing: Record<string, any>) => (
                      <SingleProduct
                        onMouseOver={() =>
                          handleMouseOver({
                            lat: listing.lat,
                            lng: listing.lng,
                          })
                        }
                        onMouseLeave={() => setHovredItem(undefined)}
                        key={listing.id}
                        data={listing as any}
                      />
                    ))}
                  </div>
                )}
                <div className="hidden md:block w-full md:w-auto col-span-1  min-h-[70vh] max-h-[70vh] !mt-0">
                  <MapView
                    markers={listingMarkers}
                    center={center}
                    zoom={zoom}
                    onIdle={onIdle}
                    onCenterChange={handleOnChanterChange}
                    focusedMarker={hovredItem}
                  />
                </div>
              </div>
            )}
            {filterOption === "category" && (
              <div className="">
                <h1 className="text-2xl font-lota font-semibold mt-5">
                  Category
                </h1>
                <div className="flex flex-wrap gap-10 mt-5 px-16">
                  {categoryList?.category?.map(
                    (category: Record<string, string>) => (
                      <div
                        onClick={() => onSearchByCategory(category.name)}
                        key={category.id}
                        className="cursor-pointer"
                      >
                        <div className="w-36 h-36 font-lota bg-[#9D9D9D]/10 text-[#0A2429] rounded-full flex justify-center items-center">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="object-cover w-[43px] max-w-full"
                          />
                        </div>
                        <h4 className="text-center text-2xl mt-5">
                          {category.name}
                        </h4>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
            {filterOption === "location" && (
              <div className="mt-10">
                <h1 className="text-2xl">Select Location</h1>
                <div className="mt-10">
                  <div
                    className="py-3 px-7 text-white flex items-center border rounded-[5px] cursor-pointer"
                    onClick={getCurrentLocation}
                  >
                    <div className="pr-3">
                      <BiCurrentLocation className="text-xl text-primary" />
                    </div>
                    <div className="text-[#263238] font-sofia-pro">
                      <h3 className="text-sm">Select My Location</h3>
                      <p className="text-xs font-light mt-2">
                        We will show you items near you sorted by distance
                      </p>
                    </div>
                  </div>
                </div>
                <h1 className="mt-7 font-lota text-2xl text-[#0A2429]">
                  Popular
                </h1>
                <ul className="mt-7">
                  {topCities.map((itm, idx) => (
                    <li
                      onClick={() => onLocationSelect(itm)}
                      className="text-lg py-2.5 font-lota text-[#0A2429] cursor-pointer"
                      key={idx}
                    >
                      {itm.city}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {filterOption === "date" && (
              <div className="mt-10">
                <h1 className="text-2xl">Date</h1>
                <div className="mt-5 flex justify-center items-center">
                  <div className="shadow rounded-lg">
                    <DatePicker
                      selected={selectedDataRange}
                      onChange={setSelectedDateRange}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-5 py-2 w-[71%]">
                  <button
                    onClick={clearDateFilter}
                    className="w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold"
                  >
                    Clear
                  </button>
                  <button
                    onClick={applyDateFilter}
                    className="px-10 font-sofia-pro bg-secondary hover:bg-primary rounded-md text-white h-12 items-center text-lg font-semibold"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSearch;
