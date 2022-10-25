import React, { useEffect, useState } from "react";
import { DateRange, DayPicker, Matcher } from "react-day-picker";

const DatePicker = ({
  selected,
  onChange,
  disabled,
}: {
  selected?: DateRange;
  onChange?: (date?: DateRange) => void;
  disabled?: Matcher | Matcher[];
}) => {
  // useEffect(() => {
  //   console.log("disabled: ", disabled);
  // }, [disabled]);
  return (
    <DayPicker
      defaultMonth={new Date()}
      disabled={disabled}
      mode="range"
      numberOfMonths={2}
      selected={selected}
      onSelect={(range) => onChange?.(range)}
    />
  );
};
export default DatePicker;
