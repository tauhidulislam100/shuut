import React, { useEffect, useState } from "react";
import {
  DateRange,
  DayClickEventHandler,
  DayModifiers,
  DayPicker,
  Matcher,
} from "react-day-picker";

const DatePicker = ({
  selected,
  onChange,
  disabled,
  priceOption,
  onDayClick,
}: {
  selected?: DateRange;
  onChange?: (date?: DateRange) => void;
  disabled?: Matcher | Matcher[];
  priceOption?: string;
  onDayClick?: DayClickEventHandler;
}) => {
  const min = priceOption === "daily" ? 2 : undefined;
  // priceOption === "weekly"
  // ? 8
  // : priceOption === "monthly"
  // ? 31
  // : undefined;

  return (
    <DayPicker
      onDayClick={onDayClick}
      defaultMonth={new Date()}
      disabled={disabled ?? { before: new Date() }}
      mode="range"
      numberOfMonths={2}
      selected={selected}
      onSelect={(range) => onChange?.(range)}
      min={min}
    />
  );
};
export default DatePicker;
