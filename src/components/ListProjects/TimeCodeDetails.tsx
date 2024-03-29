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
  TimeCodes,
  TimeRegistration,
  TimeSheetCodeProps,
  TimeSheetCodes,
  Times,
  useTimeRegistration,
} from "../../context/TimeRegistrationContext";
import {
  getDateLovs,
  getTimeSheetRegistration,
  pinnedUserTimeSheetCode,
} from "../../api/request";
import { SessionContext } from "../../context/SessionContext";

type timeCodeProps = {
  timeResgistration: TimeSheetCodes[] | undefined;
  data: TimeSheetCodes;
  date?: string;
  key: number;
  totalTime: number;
  screen?: string;
  edit: (data: Times) => void;
  remove: (data: Times) => void;
};

export const TimeCodeItemDetail: React.FC<timeCodeProps> = ({
  data,
  screen,
  edit,
  remove,
}) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timesDetails, setTimeDetails] = useState<Times[]>();
  const [menuOpenArray, setMenuOpenArray] = useState<boolean[]>(
    timesDetails?.map(() => false) || []
  );
  const [allMenusOpen, setAllMenusOpen] = useState<boolean>(false);
  const [timesSelected, setSelectedTimes] = useState<Times>();
  const { timeRegistrations, listTimeRegistration, currentFrameDate } =
    useTimeRegistration();
  const { isLoggedIn, userId, token, orgId, login, logout } =
    useContext(SessionContext);

  useEffect(() => {
    const dataDetails = data.times.flatMap((timeSheetCode) => timeSheetCode);
    const booleanArray: boolean[] = Array(data.times.length).fill(false);

    setTimeDetails(dataDetails);
    setMenuOpenArray(booleanArray);

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) {
        return;
      }

      if (!menuRef.current.contains(event.target as Node)) {
        closeAllMenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [data]);

  const closeAllMenus = () => {
    setMenuOpenArray(Array(data.times.length).fill(false));
  };

  const toggleMenu = (index: number) => {
    if (!timeRegistrations?.complete) {
      const newMenuOpenArray = menuOpenArray.map((isOpen, i) =>
        i === index ? !isOpen : false
      );
      setMenuOpenArray(newMenuOpenArray);
    }
  };

  const handleDelete = (data: Times, index: number) => {
    const newMenuOpenArray = [...menuOpenArray];
    newMenuOpenArray[index] = false;
    setSelectedTimes(data);
    setIsModalOpen(true);

    setMenuOpenArray(newMenuOpenArray);
  };

  const editTimeCode = (item: Times) => {
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

    await pinnedUserTimeSheetCode(params, token || "");

    const dataRes = await getDateLovs(
      orgId || 0,
      "TIMEFRAME",
      currentFrameDate?.date || new Date().toDateString(),
      currentFrameDate?.date || new Date().toDateString(),
      token || ""
    );

    const userTimeRegistrationList = await getTimeSheetRegistration(
      orgId || 0,
      userId || 0,
      dataRes.id,
      token || ""
    );
    data.pinned = !data.pinned;
    listTimeRegistration(userTimeRegistrationList);
  };

  const handleConfirmDelete = () => {
    const data: any = timesSelected || undefined;
    remove(data);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-red" ref={menuRef}>
      <DeleteTimRegistration
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleConfirmDelete()}
        title="Delete Confirmation"
        message="Are you sure you want to delete this item?"
      />

      {timesDetails?.map((item, index) => {
        return (
          <div
            key={index}
            className="w-full relative p-2 flex flex-col justify-between rounded-sm bg-white pr-4 pl-4 mt-4"
          >
            <div className="project-title flex flex-row justify-between mb-2">
              <div className="flex flex-row justify-start items-center  overflow-hidden">
                <span className=" text-[#1C85E8] font-semibold uppercase font-sans overflow-ellipsis overflow-hidden text-lg  mr-1">
                  {data.timeCode.tsCode}
                </span>
                {data.pinned ? <FaThumbtack color="#E5C911" /> : <></>}
              </div>
              <div className="flex items-center">
                <button onClick={() => toggleMenu(index)}>
                  <FaEllipsisV color="#ABABAB" />
                </button>
                {menuOpenArray[index] && (
                  <div className="origin-top-right absolute right-0  mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1 ">
                      {screen !== "mainScreen" ? (
                        <button
                          className="w-full flex flex-row items-center py-2 text-sm text-gray-700"
                          onClick={() => editTimeCode(item)}
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
                        onClick={() => handleDelete(item, index)}
                      >
                        <FaTrash className="ml-4 mr-3" />
                        Delete Times
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="total-hours-days flex flex-row text-[#8F8F8F]   text-lg">
              <span className="mr-6">Total Hours: {data.totalTime || 0}</span>
              <span>
                Total Days:{" "}
                {data.totalTime ? (data.totalTime / 8).toFixed(1) : 0}
              </span>
            </div>
            {screen !== "mainScreen" ? (
              <div className="flex pt-2 mt-2 flex-row items-center border-t-2">
                <span className="text-[#0B2E5F] font-semibold mr-6">
                  {item?.hours} hours
                </span>
                <span>
                  {item?.comments ? <FaComment color="#1C85E8" /> : <></>}
                </span>
              </div>
            ) : (
              <></>
            )}
          </div>
        );
      })}
    </div>
  );
};
