import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';

const DatePicker = () => {

    const [selectedDay, setSelectedDay] = useState<Date>();
    console.log(selectedDay);

    return (
        <DayPicker
            mode='range'
            numberOfMonths={2} 
            pagedNavigation
            selected={selectedDay}
            onSelect={setSelectedDay} />
    )
};
export default DatePicker;