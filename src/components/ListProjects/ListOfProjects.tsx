import { useState, useEffect, useRef, useContext } from "react";
import {
  FaComment,
  FaEdit,
  FaEllipsisV,
  FaThumbtack,
  FaTrash,
} from "react-icons/fa";
import DeleteTimRegistration from "../DeleteTimeRegistration/DeleteTimeRegistration";
import {
  TimeRegistration,
  TimeSheetCodeProps,
  TimeSheetCodes,
  useTimeRegistration,
} from "../../context/TimeRegistrationContext";
import {
  getDateLovs,
  getTimeSheetRegistration,
  pinnedUserTimeSheetCode,
} from "../../api/request";
import { SessionContext } from "../../context/SessionContext";

type timeCodeProps = {
  data: TimeSheetCodes;
  key?: number;
  screen?: string;
  edit: (data: TimeSheetCodes) => void;
  remove: (data: TimeSheetCodes) => void;
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
  const [totalHours, setTotalHours] = useState<number>();
  const { timeRegistrations, listTimeRegistration, currentFrameDate } =
    useTimeRegistration();
  const { isLoggedIn, userId, orgId, login, logout } =
    useContext(SessionContext);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const totalTime = data.times.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.hours;
    }, 0);

    setTotalHours(totalTime);

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    if (!timeRegistrations?.complete) setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleDelete = (data: TimeSheetCodes) => {
    setIsModalOpen(true);
  };

  const editTimeCode = (item: TimeSheetCodes) => {
    edit(item);
  };

  const setPinned = async (data: TimeSheetCodes) => {
    setMenuOpen(false);

    const params: TimeSheetCodeProps = {
      id: data.id,
      pinned: !data.pinned,
      timeSheetId: data.timeSheetId,
      timeCodeId: data.timeCodeId,
    };

    await pinnedUserTimeSheetCode(params);

    const dataRes = await getDateLovs(
      orgId || 0,
      "TIMEFRAME",
      currentFrameDate?.date || new Date().toDateString(),
      currentFrameDate?.date || new Date().toDateString()
    );

    const userTimeRegistrationList = await getTimeSheetRegistration(
      orgId || 0,
      userId || 0,
      dataRes.id
    );

    listTimeRegistration(userTimeRegistrationList);
  };

  const handleConfirmDelete = (data: TimeSheetCodes) => {
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

      <div
        key={key}
        className="project-title flex flex-row justify-between mb-2"
      >
        <div className="flex flex-row justify-start items-center">
          <span className=" text-[#1C85E8] font-semibold uppercase font-sans text-base   mr-6">
            {data.timeCode.tsCode}
          </span>
          {data.pinned ? <FaThumbtack color="#E5C911" /> : <></>}
        </div>
        <div className="flex items-center">
          <button onClick={toggleMenu}>
            <FaEllipsisV color="#ABABAB" />
          </button>
          {menuOpen && (
            <div className="origin-top-right absolute right-0  mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1 ">
                {screen !== "mainScreen" ? (
                  <button
                    className="w-full flex flex-row items-center py-2 text-sm text-gray-700"
                    onClick={() => editTimeCode(data)}
                  >
                    <FaEdit className="ml-4 mr-3" />
                    Edit Code
                  </button>
                ) : (
                  <></>
                )}
                <button
                  className="w-full flex flex-row items-center py-2 text-sm text-gray-700"
                  onClick={() => setPinned(data)}
                >
                  <FaThumbtack className="ml-4 mr-3" />
                  {data.pinned ? "Unpin Project" : "Pin Project"}
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
      <div className="total-hours-days flex flex-row text-[#8F8F8F]   text-base ">
        <span className="mr-6">Total Hours: {totalHours || 0}</span>
        <span>Total Days: {totalHours ? (totalHours / 8).toFixed(1) : 0}</span>
      </div>
      {screen !== "mainScreen" ? (
        <div className="flex pt-2 mt-2 flex-row items-center border-t-2">
          <span className="text-[#0B2E5F] font-semibold mr-6">0 hours</span>
          <span>
            <FaComment color="#1C85E8" />
          </span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
