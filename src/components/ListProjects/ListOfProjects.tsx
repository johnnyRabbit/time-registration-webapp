import { useState, useEffect, useRef } from "react";
import {
  FaComment,
  FaEdit,
  FaEllipsisV,
  FaThumbtack,
  FaTrash,
} from "react-icons/fa";
import { TimeRegistrationProps } from "../AddTimeRegistration/AddTimeRegistration";
import DeleteTimRegistration from "../DeleteTimeRegistration/DeleteTimeRegistration";

type timeCodeProps = {
  data: TimeRegistrationProps;
  key: number;
  screen?: string;
  edit: (data: TimeRegistrationProps) => void;
  remove: (data: TimeRegistrationProps) => void;
};

export const TimeCodeItem: React.FC<timeCodeProps> = ({
  data,
  key,
  screen,
  edit,
  remove,
}) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleDelete = (data: TimeRegistrationProps) => {
    setIsModalOpen(true);
  };

  const editTimeCode = (item: TimeRegistrationProps) => {
    edit(item);
  };

  const setPinned = () => {};

  const handleConfirmDelete = (data: TimeRegistrationProps) => {
    remove(data);
    setIsModalOpen(false);
  };

  return (
    <div
      className="w-full relative p-2 flex flex-col justify-between rounded-sm bg-white pr-4 pl-4 mt-4"
      ref={menuRef}
    >
      <DeleteTimRegistration
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleConfirmDelete(data)}
        title="Delete Confirmation"
        message="Are you sure you want to delete this item?"
      />

      <div className="project-title flex flex-row justify-between mb-2">
        <div className="flex flex-row justify-start items-center">
          <span className=" text-[#1C85E8] font-semibold uppercase font-sans text-lg mr-6">
            {data.timeCode}
          </span>
          <FaThumbtack color="#E5C911" />
        </div>
        <div className="flex items-center">
          <button onClick={toggleMenu}>
            <FaEllipsisV color="#ABABAB" />
          </button>
          {menuOpen && (
            <div className="origin-top-right absolute right-0  mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1 ">
                <button
                  className="w-full flex flex-row items-center py-2 text-sm text-gray-700"
                  onClick={() => editTimeCode(data)}
                >
                  <FaEdit className="ml-4 mr-3" />
                  Edit Code
                </button>
                <button
                  className="w-full flex flex-row items-center py-2 text-sm text-gray-700"
                  onClick={() => console.log("Pinned")}
                >
                  <FaThumbtack className="ml-4 mr-3" />
                  Pin Project
                </button>
                <button
                  className="w-full flex flex-row items-center py-2 text-sm text-gray-700"
                  onClick={() => handleDelete(data)}
                >
                  <FaTrash className="ml-4 mr-3" />
                  Delete Code
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="total-hours-days flex flex-row text-[#8F8F8F]   text-lg">
        <span className="mr-6">Total Hours: {data.time}</span>
        <span>Total Days: {(data.time / 8).toFixed(1)}</span>
      </div>
      <div className="flex pt-2 mt-2 flex-row items-center border-t-2">
        <span className="text-[#0B2E5F] font-semibold mr-6">0 hours</span>
        <span>
          <FaComment color="#1C85E8" />
        </span>
      </div>
    </div>
  );
};
