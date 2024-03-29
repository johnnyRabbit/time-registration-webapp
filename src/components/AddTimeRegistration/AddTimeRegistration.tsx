import React, { useContext, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import {
  Event,
  TimeRegistrationFormProps,
} from "../EventCalendar/EventCalendar";
import {
  addUserTimeRegistration,
  addUserTimeSheetCode,
  getUserTimeCodes,
} from "../../api/request";
import {
  TimeCodes,
  TimeSheetCodes,
  useTimeRegistration,
} from "../../context/TimeRegistrationContext";
import { SessionContext } from "../../context/SessionContext";

interface TimeRegistration {
  onCancel: () => void;
  onSubmit: (data: TimeRegistrationFormProps) => void; // Define the callback prop
  data: Event;
  showForm: boolean;
  formData: TimeRegistrationFormProps;
  timeSheet: TimeSheetCodes[] | [];
}

const TimeRegistrationForm: React.FC<TimeRegistration> = ({
  onCancel,
  onSubmit,
  formData,
}) => {
  const [timeData, setTimeData] = useState<TimeRegistrationFormProps>(formData);
  const [timeCode, setUserimeCode] = useState<TimeCodes[]>();
  const { timeSheetCodes, selectedDates, timeRegistrations } =
    useTimeRegistration();
  const { userId, orgId, token } = useContext(SessionContext);

  useEffect(() => {
    const fetchUserTimeCodes = async () => {
      try {
        const data = await getUserTimeCodes(
          orgId || 0,
          userId || 0,
          token || ""
        );

        setUserimeCode(data);

        if (timeSheetCodes) {
          setTimeCode(timeSheetCodes?.timeCode.tsCode);
          setTime(timeSheetCodes?.times[0]?.hours || 0);
          setDescription(timeSheetCodes?.times[0]?.comments || "");
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchUserTimeCodes();
  }, []);

  const setDescription = (newDescription: string) => {
    setTimeData((prevData) => ({ ...prevData, comments: newDescription }));
  };

  const setTimeCode = (newTimeCode: string) => {
    console.log("new", newTimeCode);
    let timeCodeId: number = -1;

    if (newTimeCode !== "-1") {
      timeCodeId =
        timeCode?.filter((item) => item.tsCode === newTimeCode)[0].id ||
        timeSheetCodes?.timeCode.id ||
        0;
    }

    setTimeData((prevData) => ({
      ...prevData,
      timeCodeName: newTimeCode,
      timeCodeId: timeCodeId || -1,
    }));
  };

  const setTime = (newTime: number) => {
    if (newTime >= 0 && newTime <= 16) {
      setTimeData((prevData) => ({ ...prevData, hours: newTime }));
    }
  };

  const incrementTime = () => {
    setTime(timeData.hours + 0.5);
  };

  const decrementTime = () => {
    setTime(timeData.hours - 0.5);
  };

  const handleFormSubmit = async () => {
    if (timeRegistrations && selectedDates) {
      timeData.id = timeSheetCodes?.times[0]?.id || 0;

      onSubmit(timeData);
    }
  };

  return (
    <div className="flex flex-col pr-4 pl-4">
      <div className="w-full">
        <select
          className="w-full p-4 text-gray-500 bg-white border border-r-transparent"
          style={{
            borderRight: "16px solid transparent",
            fontWeight: 600,
            color: "#454548",
            fontSize: "16px",
          }}
          value={timeData.timeCodeName}
          onChange={(e) => setTimeCode(e.target.value)}
        >
          <option value={-1}>Select Timecode</option>
          {timeCode?.map((item, index) => {
            return (
              <option key={item.id} value={item.tsCode}>
                {item.tsCode}
              </option>
            );
          })}
        </select>
      </div>

      <div className="mb-4 mt-4 rounded-sm bg-white">
        <div className="flex items-center justify-center border rounded-sm h-14">
          <button
            className="px-4 py-4 border-r"
            onClick={() => decrementTime()}
          >
            <FaMinus color="#0B2E5F" />
          </button>
          <input
            className="w-full px-4 py-2 text-gray-700 rounded text-center"
            type="text"
            // placeholder="0"
            value={timeData.hours}
            onChange={(e) => setTime(Number(e.target.value))}
          />
          <button
            className="px-4 py-4  border-l"
            onClick={() => incrementTime()}
          >
            <FaPlus color="#0B2E5F" size={16} />
          </button>
        </div>
      </div>
      <div className="w-ful">
        <div className="w-full flex flex-col">
          <textarea
            id="message"
            rows={4}
            style={style.textAreaStyle}
            value={timeData.comments}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add comment.."
          ></textarea>
        </div>
      </div>
      <div className="w-full  flex justify-between mt-8 h-14">
        <button
          className="border border-[#0B2E5F] flex-1 text-[#0B2E5F] font-semibold text-base bo px-8 py-2 rounded-sm"
          onClick={() => onCancel()}
        >
          Cancel
        </button>
        <div className="w-4"></div>
        <button
          disabled={
            selectedDates?.length === 0 ||
            timeData.timeCodeName === "-1" ||
            timeData.timeCodeName === "" ||
            timeData.hours === 0
          }
          className={`${
            selectedDates?.length
              ? selectedDates?.length > 0 &&
                timeData.timeCodeName !== "-1" &&
                timeData.timeCodeName !== "" &&
                timeData.hours !== 0
                ? "bg-[#0B2E5F]"
                : "bg-[#BCBCBC]"
              : "bg-[#BCBCBC]"
          } font-semibold text-base flex-1 text-white px-4 py-2 rounded-sm`}
          onClick={handleFormSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

const style = {
  textAreaStyle: {
    padding: "15px",
    background: "#FFFFF",
    boxShadow: "inset 0px 0px 7px #00000029",
    border: "1px solid #DFDFDF",
    borderRadius: "5px",
  },
};

export default TimeRegistrationForm;
