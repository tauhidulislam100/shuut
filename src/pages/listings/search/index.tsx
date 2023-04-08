import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import {
  CategoryFilterView,
  DatePicker,
  LocationFilterView,
  MapView,
  NavBar,
  SingleProduct,
} from "../../../components";
import { topCities } from "../../../data";
import { BsArrowLeftCircle } from "react-icons/bs";
import { RiEqualizerLine } from "react-icons/ri";
import { BiCurrentLocation } from "react-icons/bi";
import { Dropdown, notification, Radio, RadioChangeEvent, Spin } from "antd";
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
import Back from "../../../components/Back";

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

const FilterButton = ({
  children,
  className,
  activeFilter = false,
  onClick,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  activeFilter?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={`md:px-3 md:min-w-[121px] md:font-sofia-pro md:bg-[#FAFAFA] md:border  md:hover:border-secondary md:rounded-md  md:hover:text-secondary md:h-12 items-center ${
        activeFilter
          ? "md:border-secondary text-secondary font-semibold"
          : "md:border-[#DFDFE6] md:text-[#0A2429]"
      }`}
    >
      {children}
    </button>
  );
};
const DropdownBody = ({
  dropdownData,
  selectedValue,
  onSortingChange,
}: dropdownProps) => {
  return (
    <Radio.Group
      value={selectedValue}
      className="!bg-white !shadow-lg !rounded-lg"
    >
      {dropdownData.map((itm: dropItems, idx: number) => (
        <li
          key={`dropdown_${idx}_${itm.value}`}
          className="!text-sm !font-lota !border-b-[1.5px] !text-[#969696]"
        >
          <Radio
            value={itm.value}
            onChange={onSortingChange}
            className="!text-[#969696] !px-3.5 !py-2.5"
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
    if (query) {
      setSearchText(query as string);
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, query: undefined },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router]);

  useAsyncEffect(
    async (isMounted) => {
      if (isMounted()) {
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

  useEffect(() => {
    if (router.query._location) {
      setFilterOption("location");
      setSelectedCategoryName(router.query.category as string);
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, _location: undefined, category: undefined },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router]);

  const onSearch = async () => {
    await searchListing({
      variables: {
        lat: center.lat,
        lng: center.lng,
        distance_in_meters: defaultRadius,
        queryText: searchText,
      },
    });
  };

  const onSearchByCategory = async (categoryName?: string) => {
    setFilterOption("");
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

  const clearCategoryFilter = () => {
    setFilterOption("");
    setSelectedCategoryName(undefined);
  };

  const handleOnChanterChange = (map: google.maps.Map) => {
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
      <Back />
      <button
        onClick={() => setShowMap((prev) => !prev)}
        className="md:hidden z-[5000] fixed bottom-5 left-10 text-white bg-secondary rounded-full h-8 w-16 grid place-items-center text-lg"
      >
        {showMap ? <FaList /> : <FaMapMarkerAlt />}
      </button>
      <div className="bg-[#FFFFFF] border-opacity-30 pt-4 pb-10">
        <div className="container">
          <div className="space-y-5 sm:space-y-0 lg:flex justify-between items-center">
            <div className="flex items-center lg:w-[430px] mdMax:mb-4 w-full max-w-full border border-body-light rounded-lg p-[2px] relative">
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
            <div className="flex items-center gap-5 overflow-x-scroll sm:overflow-x-auto border-b-2 border-[#1C1D2208] pb-2 md:pb-0 md:border-none">
              <FilterButton
                onClick={() => {
                  setFilterOption("category");
                }}
                activeFilter={
                  !!selectedCategoryName || filterOption === "category"
                }
              >
                Category
              </FilterButton>
              <FilterButton
                onClick={() => setFilterOption("location")}
                activeFilter={true}
              >
                {isMapCenterChanged
                  ? "Location Selected By Map"
                  : (center as any)?.city
                  ? (center as any)?.city
                  : "Location"}
              </FilterButton>
              <FilterButton
                onClick={() => {
                  setFilterOption("date");
                }}
                activeFilter={!!selectedDataRange || filterOption === "date"}
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
              </FilterButton>
              <Dropdown
                className="ml-auto"
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
                <button className="text-[#0A2429] hover:text-secondary">
                  <RiEqualizerLine className="text-3xl" />
                </button>
              </Dropdown>
            </div>
          </div>
          <div className="pt-5 max-h-[calc(100vh-250px)] h-[calc(100vh-250px)] md:h-[auto] md:max-h-[auto] overflow-y-scroll md:overflow-y-visible">
            <div
              className={`min-w-full w-full h-full ${
                showMap ? "block md:hidden" : "hidden"
              }`}
            >
              <MapView
                markers={listingMarkers}
                center={center}
                zoom={zoom}
                onIdle={onIdle}
                onCenterChange={handleOnChanterChange}
                focusedMarker={hovredItem}
              />
            </div>
            <div className={`${showMap ? "hidden md:block" : "block"}`}>
              {filterOption === "" && (
                <div className="space-y-5 md:grid lg:grid-cols-3 grid-cols-2 gap-7 mt-10">
                  {loading ? (
                    <div className="col-span-2 grid place-items-center">
                      <Spin size="large" />
                    </div>
                  ) : (
                    <div className="lg:col-span-2 sm:grid xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 xs:grid-cols-2 grid-cols-1  gap-5 items-start">
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
                      {!data?.listings?.length ? (
                        <div className="col-span-full grid place-items-center h-[40vh] text-center">
                          <p className="text-base font-medium font-lota text-primary max-w-[400px]">
                            Sorry, we were unable to find any products that
                            match your search/filter criteria. Please try again
                            with different search/filter terms or browse through
                            our selection of products.
                          </p>
                        </div>
                      ) : null}
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
                <>
                  <CategoryFilterView
                    selected={selectedCategoryName}
                    onChange={(name) => setSelectedCategoryName(name)}
                    categoryList={categoryList?.category}
                    onApply={() => onSearchByCategory(selectedCategoryName)}
                    onClear={clearCategoryFilter}
                  />
                </>
              )}
              {filterOption === "location" && (
                <LocationFilterView
                  onChange={onLocationSelect}
                  getCurrentLocation={getCurrentLocation}
                />
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
                  <div className="mt-6 flex justify-end gap-5 py-2 md:w-[71%]">
                    <button
                      onClick={clearDateFilter}
                      className="sm:w-[193px] sm:px-0 px-8 font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold"
                    >
                      Clear
                    </button>
                    <button
                      onClick={applyDateFilter}
                      className="sm:px-10 px-4 font-sofia-pro bg-secondary hover:bg-primary rounded-md text-white h-12 items-center sm:text-lg text-base font-semibold"
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
