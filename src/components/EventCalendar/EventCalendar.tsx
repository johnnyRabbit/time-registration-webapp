import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./EventCalendar.css";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import TotalTime from "../TotalTime/TotalTime";
import { TimeCodeItem } from "../ListProjects/ListOfProjects";
import TimeRegistrationForm, {
  TimeRegistrationProps,
} from "../AddTimeRegistration/AddTimeRegistration";

export interface Event {
  [date: string]: { name: string; color: string }[];
}

type EventProps = {
  showFormBox: boolean;
  onCancel: () => void | undefined;
  from: string | undefined;
};

const EventCalendar: React.FC<EventProps> = ({
  showFormBox,
  onCancel,
  from,
}) => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [showTRForm, setShowTRForm] = useState<boolean>(showFormBox);
  const [events, setEvents] = useState<Event>({});
  const [formData, setFormData] = useState<TimeRegistrationProps>({
    date: [],
    description: "",
    timeCode: "",
    time: 0,
  });
  const [totalWorkedHours, setTotalWorkedHours] = useState<number>(0);
  const [timeRegistrationList, setTimeRegistrationList] = useState<
    TimeRegistrationProps[]
  >([]);
  const [filteredData, setFilteredData] = useState<TimeRegistrationProps[]>([]);
  const [editItemTR, setEditItemTR] = useState<TimeRegistrationProps>();
  const [selectedDate, setSelectedDate] = useState<string>();

  const onAddNewTR = () => {
    console.log(filteredData);
    setShowTRForm(true);
  };

  const editTimeRegistration = (data: TimeRegistrationProps) => {
    console.log(data);
    setShowTRForm(true);

    setFormData(data);
  };

  const handleFormData = (data: TimeRegistrationProps) => {
    addEvent();
    setSelectedDates([]);
    data.date = formData.date;

    setTimeRegistrationList((prevData) => [...prevData, data]);

    setFormData(data);
  };

  const setDate = (newDate: string[]) => {
    setFormData((prevData) => ({ ...prevData, date: newDate }));
  };

  const cancelTR = () => {
    setShowTRForm(false);
    if (from === "mainScreen") onCancel();
  };

  const addEvent = () => {
    selectedDates.forEach((date) => {
      if (!events[date]) {
        events[date] = [];
      }
      events[date].push({ name: "test", color: getRandomColor() });
    });
    setEvents({ ...events });
  };

  const onSubmitTR = () => {};

  const handleDateClick = (date: Date) => {
    const formattedDate = date.toLocaleDateString();
    const filteredItems = timeRegistrationList.filter((item) =>
      item.date.includes(formattedDate)
    );

    if (!showTRForm) {
      const totalSum = filteredItems.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.time;
      }, 0);
      setFilteredData(filteredItems);
      setTotalWorkedHours(totalSum);
    }

    if (!selectedDates.includes(formattedDate) && showTRForm) {
      setSelectedDates([...selectedDates, formattedDate]);
      setDate([...selectedDates, formattedDate]);
    } else {
      setSelectedDates(selectedDates.filter((d) => d !== formattedDate));
    }
  };

  const renderEventCircles = (date: string) => {
    const eventCount = (events as Event)[date]
      ? (events as Event)[date]?.length
      : 0;

    const filteredItems = timeRegistrationList.filter((item) =>
      item.date.includes(date)
    );

    const totalSum = filteredItems.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.time;
    }, 0);

    const circleColor = totalSum <= 8 ? "bg-[#1BC800]" : "bg-[#FFD70C]";

    return (
      <div className="event-circles">
        {eventCount > 0 ? (
          <div className={`event-circle ${circleColor}`}></div>
        ) : null}
      </div>
    );
  };

  // Function to generate random colors for events
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="w-full flex flex-col">
      <Calendar
        value={new Date()}
        defaultView="month"
        minDetail="month"
        maxDetail="month"
        locale="en"
        nextLabel={<FaChevronRight />}
        prevLabel={<FaChevronLeft />}
        onClickDay={handleDateClick}
        tileClassName={({ date }) => {
          return selectedDates.includes(date.toLocaleDateString())
            ? "selected"
            : "";
        }}
        tileContent={({ date }) =>
          renderEventCircles(date.toLocaleDateString())
        }
      />
      <div className="flex flex-row pl-6 mt-4 mb-4">
        <span className="text-[#1C85E8] font-semibold">25 - </span>
        <span className="text-[black] font-semibold">Holiday </span>
      </div>
      {showTRForm ? (
        <TimeRegistrationForm
          showForm={showTRForm}
          data={events}
          onCancel={() => cancelTR()}
          onSubmit={handleFormData}
          formData={formData}
        />
      ) : (
        <>
          <TotalTime type="calendar" totalHours={totalWorkedHours} />
          <div className="pr-4 pl-4 mb-8">
            {filteredData.map((item, index) => {
              return (
                <TimeCodeItem
                  data={item}
                  key={index}
                  screen="detailScreen"
                  edit={editTimeRegistration}
                />
              );
            })}
          </div>
        </>
      )}

      {!showTRForm ? (
        <div className=" fixed bottom-6 right-3">
          <button
            className="fixed bottom-4 right-4 w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center"
            onClick={() => onAddNewTR()}
          >
            <FaPlus size={25} />
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default EventCalendar;
