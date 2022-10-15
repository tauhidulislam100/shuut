import React, { useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";

const DatePicker = ({
  selected,
  onChange,
}: {
  selected?: DateRange;
  onChange?: (date?: DateRange) => void;
}) => {
  return (
    <DayPicker
      defaultMonth={new Date()}
      mode="range"
      numberOfMonths={2}
      selected={selected}
      onSelect={(range) => onChange?.(range)}
    />
  );
};
export default DatePicker;
