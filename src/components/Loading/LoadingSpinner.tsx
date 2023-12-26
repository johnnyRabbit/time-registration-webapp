import React from "react";
import LoadingImag from "./img/load_transparent_medium_01.gif";

const LoadingModal: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-gray-800 bg-opacity-50">
      <div className=" p-8 flex flex-col items-center w-44 h-44">
        <div className="flex items-center mb-4">
          <div className="ml-4  w-44 h-44 text-lg font-semibold">
            <img src={LoadingImag} className=" w-44 h-44" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
