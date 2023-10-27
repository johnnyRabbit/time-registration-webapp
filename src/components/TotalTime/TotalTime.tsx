import { useState } from "react";
import { FaEllipsisV, FaThumbtack } from "react-icons/fa";

interface TotalTimeProps {
  type: string;
  totalHours?: number;
}

const TotalTime: React.FC<TotalTimeProps> = ({ type, totalHours }) => {
  return (
    <div className="total-container pr-4 pl-4 mb-2 mt-2 w-full justify-between">
      <div className="w-full flex flex-row justify-between p-2 pr-4 pl-4 bg-white mb-2 rounded-md">
        <span className=" text-[#0B2E5F] font-semibold text-lg ">
          Total Work Hours:
        </span>
        <span className=" text-[#0B2E5F] text-lg">{totalHours || 0}</span>
      </div>
      {type !== "calendar" ? (
        <div className="w-full flex flex-row justify-between p-2  pr-4 pl-4  bg-white rounded-md">
          <span className=" text-[#0B2E5F] text-lg">Total Work Days:</span>
          <span className=" text-[#0B2E5F] text-lg">0</span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TotalTime;
