import React, { useState } from "react";
import Calendar from "react-calendar";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";

import "react-calendar/dist/Calendar.css";
import "./SpecificMonthsCalendar.css"; // Import your custom CSS file

interface SpecificMonthsCalendarProps {
  allowedMonths: Date[];
}

const SpecificMonthsCalendar: React.FC<SpecificMonthsCalendarProps> = ({
  allowedMonths,
}) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(0);

  const handlePreviousMonth = () => {
    setCurrentMonthIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prevIndex) =>
      prevIndex < allowedMonths.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handleCustomNext = () => {
    // Custom function for next button functionality
    handleNextMonth(); // Call your specific logic here
  };

  const handleCustomPrevious = () => {
    // Custom function for previous button functionality
    handlePreviousMonth(); // Call your specific logic here
  };

  return (
    <div className="custom-calendar-container">
      <button
        className="custom-navigation-button-left"
        onClick={handleCustomPrevious}
      >
        <FaChevronLeft />
      </button>
      <div className="custom-calendar">
        <Calendar
          value={allowedMonths[currentMonthIndex]}
          onChange={() => {}}
          // Add other properties or event handlers if needed
          tileDisabled={({ date }) => {
            const isAllowed = allowedMonths.some(
              (allowedDate) =>
                allowedDate.getFullYear() === date.getFullYear() &&
                allowedDate.getMonth() === date.getMonth()
            );
            return !isAllowed;
          }}
        />
      </div>
      <button
        className="custom-navigation-button-right"
        onClick={handleCustomNext}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default SpecificMonthsCalendar;
