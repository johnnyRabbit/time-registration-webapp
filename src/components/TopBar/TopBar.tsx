import React from "react";
import { isMobile, isBrowser, isAndroid, isIOS } from "react-device-detect";

interface TopBarProps {
  title: string;
  view: string;
}

const TopBar: React.FC<TopBarProps> = ({ title, view }) => {
  return (
    <div
      className={`bg-[#FFFFFF] text-[#3A3A3A] py-4 px-4 flex items-center justify-between fixed top-${
        isMobile && isIOS ? 10 : 0
      } w-full z-10`}
    >
      <div
        className="flex items-center cursor-pointer"
        id="backBtn"
        datatype={view}
      >
        {/* You can use an SVG or an icon library for the back arrow */}
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </div>
      <div className="text-lg font-bold">{title}</div>
      <div className="w-6"></div>
    </div>
  );
};

export default TopBar;
