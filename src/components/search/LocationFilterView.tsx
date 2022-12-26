import React from "react";
import { BiCurrentLocation } from "react-icons/bi";
import { topCities } from "../../data";

interface IProps {
  onChange?: (location: Record<string, any>) => void;
  getCurrentLocation?: () => void;
}
const LocationFilterView = ({ getCurrentLocation, onChange }: IProps) => {
  return (
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
      <h1 className="mt-7 font-lota text-2xl text-[#0A2429]">Popular</h1>
      <ul className="mt-7">
        {topCities.map((itm, idx) => (
          <li
            onClick={() => onChange?.(itm)}
            className="text-lg py-2.5 font-lota text-[#0A2429] cursor-pointer"
            key={idx}
          >
            {itm.city}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationFilterView;
