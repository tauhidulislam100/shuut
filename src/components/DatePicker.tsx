import React from "react";
import {
  DateRange,
  DayClickEventHandler,
  DayPicker,
  Matcher,
} from "react-day-picker";

const DatePicker = ({
  selected,
  disabled,
  priceOption,
  disableBefore = true,
  onChange,
  onDayClick,
}: {
  selected?: DateRange;
  disabled?: Matcher | Matcher[];
  priceOption?: string;
  disableBefore?: boolean;
  onChange?: (date?: DateRange) => void;
  onDayClick?: DayClickEventHandler;
}) => {
  const min = priceOption === "daily" ? 2 : undefined;
  return (
    <DayPicker
      onDayClick={onDayClick}
      defaultMonth={new Date()}
      disabled={
        disabled ? disabled : disableBefore ? { before: new Date() } : undefined
      }
      mode="range"
      numberOfMonths={2}
      selected={selected}
      onSelect={(range) => onChange?.(range)}
      min={min}
    />
  );
};
export default DatePicker;
