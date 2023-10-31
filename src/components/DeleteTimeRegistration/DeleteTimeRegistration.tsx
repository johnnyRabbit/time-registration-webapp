import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

const DeleteTimRegistration: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto">
      <div
        className="absolute inset-0 bg-gray-900 opacity-50"
        onClick={onClose}
      ></div>
      <div className="flex flex-col justify-around z-50 bg-white text-center p-2 rounded-lg shadow-lg w-96 h-64">
        <h2 className="text-md flex-2 text-[#ABABAB] ">{title}</h2>
        <p className="text-[#0B2E5F] flex-3 font-semibold text-xl ">
          {message}
        </p>
        <div className=" flex justify-around h-12">
          <button
            className="px-4 py-2 flex-1 bg-white border border-[#0B2E5F] text-gray-700 rounded"
            onClick={onClose}
          >
            <span>CANCEL</span>
          </button>
          <div className="m-1"></div>
          <button
            className="mr-2 px-4 py-2 flex-1 bg-[#0B2E5F] text-white rounded"
            onClick={onConfirm}
          >
            <span>YES</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTimRegistration;
