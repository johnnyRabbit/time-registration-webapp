import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const MonthYear = () => {
  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear: number = new Date().getFullYear();

  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(
    new Date().getMonth()
  );

  const handleMonth = (type: string) => {
    if (type === "next" && currentMonthIndex < 11) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    } else if (type !== "next" && currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  return (
    <div className="w-full p-2 flex flex-row justify-between bg-white items-center">
      <div className="month-year-container">
        <button
          onClick={() => handleMonth("prev")}
          className="flex items-center justify-center text-gray-500 hover:text-gray-800"
        >
          <FaChevronLeft />
        </button>
      </div>
      <div className="">
        <div className="flex items-center justify-center h-12">
          <p className="text-2xl font-semibold">
            {months[currentMonthIndex]}, {currentYear}
          </p>
        </div>
      </div>
      <div>
        <button
          className="flex items-center justify-center text-gray-500 hover:text-gray-800"
          onClick={() => handleMonth("next")}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};
