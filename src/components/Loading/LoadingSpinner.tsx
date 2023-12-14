import React from "react";

const LoadingModal: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <div className="flex items-center mb-4">
          <div className="animate-spin rounded-full border-t-4 border-b-4 border-gray-500 h-12 w-12"></div>
          <div className="ml-4 text-lg font-semibold">Loading Data...</div>
        </div>
        <p className="text-gray-600">Please wait while we load the data.</p>
      </div>
    </div>
  );
};

export default LoadingModal;
