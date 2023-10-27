import React, { useState } from "react";
import { Textarea } from "@material-tailwind/react";
import CustomButton from "../CustomButton/CustomButton";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Event } from "../EventCalendar/EventCalendar";

interface TimeRegistration {
  onCancel: () => void;
  onSubmit: (data: TimeRegistrationProps) => void; // Define the callback prop
  data: Event;
  showForm: boolean;
  formData: TimeRegistrationProps;
}

export type TimeRegistrationProps = {
  date: string[];
  description: string;
  timeCode: string;
  time: number;
};

const TimeRegistrationForm: React.FC<TimeRegistration> = ({
  onCancel,
  onSubmit,
  formData,
}) => {
  const [timeData, setTimeData] = useState<TimeRegistrationProps>(formData);

  const setDescription = (newDescription: string) => {
    setTimeData((prevData) => ({ ...prevData, description: newDescription }));
  };

  const setTimeCode = (newTimeCode: string) => {
    setTimeData((prevData) => ({ ...prevData, timeCode: newTimeCode }));
  };

  const setTime = (newTime: number) => {
    if (newTime >= 0 && newTime <= 16) {
      setTimeData((prevData) => ({ ...prevData, time: newTime }));
    }
  };

  const incrementTime = () => {
    setTime(timeData.time + 0.5);
  };

  const decrementTime = () => {
    setTime(timeData.time - 0.5);
  };

  const handleFormSubmit = () => {
    const formData = {
      date: timeData.date,
      description: timeData.description,
      timeCode: timeData.timeCode,
      time: timeData.time,
    };

    onSubmit(formData);
    setTimeData({ date: [], description: "", timeCode: "", time: 0 });
  };

  return (
    <div className="flex flex-col pr-4 pl-4">
      <div className="w-full max-w-sm">
        <select
          className="w-full p-4 text-gray-500 bg-white border border-r-transparent"
          style={{
            borderRight: "16px solid transparent",
            fontWeight: 600,
            color: "#454548",
            fontSize: "16px",
          }}
          value={timeData.timeCode}
          onChange={(e) => setTimeCode(e.target.value)}
        >
          <option value={-1}>Select Timecode</option>
          <option value="code1">Code 1</option>
          <option value="code2">Code 2</option>
          <option value="code3">Code 3</option>
          <option value="code4">Code 4</option>
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
            type="number"
            placeholder="0"
            value={timeData.time}
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
            value={timeData.description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add comment.."
          ></textarea>
        </div>
      </div>
      <div className="w-full  flex justify-between mt-8 h-14">
        <button
          className="border border-[#0B2E5F] flex-1 text-[#0B2E5F] font-semibold text-md bo px-8 py-2 rounded-sm"
          onClick={() => onCancel()}
        >
          Cancel
        </button>
        <div className="w-4"></div>
        <button
          className={`${
            timeData.description === "" ||
            timeData.timeCode === "" ||
            timeData.time === 0
              ? "bg-[#BCBCBC]"
              : "bg-[#0B2E5F]"
          } font-semibold text-md flex-1 text-white px-4 py-2 rounded-sm`}
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
