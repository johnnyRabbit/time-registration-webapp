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
  [date: string]: { id: string; name: string; color: string }[];
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
    date: "",
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
    setFormData({
      id: "",
      date: "",
      description: "",
      timeCode: "",
      time: 0,
    });
    setShowTRForm(true);
    setSelectedDates([]);
  };

  const editTimeRegistration = (data: TimeRegistrationProps) => {
    setShowTRForm(true);
    setFormData(data);
  };

  const removeItem = (data: TimeRegistrationProps): void => {
    const id = data.id || "";
    const date = data.date;

    setFilteredData((prevData) => {
      const updatedList = prevData.filter((item) => item.id !== id);

      return updatedList;
    });

    setTimeRegistrationList((prevData) => {
      const updatedList = prevData.filter((item) => item.id !== id);

      return updatedList;
    });

    removeEventCircles(id, date);
  };

  const handleFormData = (data: TimeRegistrationProps) => {
    const dataList = [...timeRegistrationList];

    if (data.id) {
      setTimeRegistrationList((prevData) => {
        const itemIndex = prevData.findIndex((item) => item.id === data.id);

        if (itemIndex === -1) {
          return prevData;
        }

        const updatedData = [...prevData];
        updatedData[itemIndex] = data;

        return updatedData;
      });
    } else {
      selectedDates.forEach((date) => {
        const updatedData = { ...data };

        updatedData.id = generateUniqueId();
        updatedData.date = date;
        dataList.push(updatedData);
        addEvent(date, updatedData.id);
      });

      setTimeRegistrationList(dataList);
    }

    //addEvent();
    setSelectedDates([]);
    setFilteredData([]);
    setShowTRForm(false);
    setFormData(data);
  };

  function generateUniqueId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${timestamp}${random}`;
  }

  const setDate = (newDate: string) => {
    setFormData((prevData) => ({ ...prevData, date: newDate }));
  };

  const cancelTR = () => {
    setShowTRForm(false);
    if (from === "mainScreen") onCancel();
  };

  const addEvent = (date: string, id: string) => {
    if (!events[date]) {
      events[date] = [];
    }

    events[date].push({ id: id, name: "test", color: getRandomColor() });

    setEvents({ ...events });
  };

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
      setDate(formattedDate);
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

  const removeEventCircles = (id: string, date: string) => {
    if (!events[date]) {
      events[date] = [];
    }

    const updatedEvents = {
      ...events,
      [date]: events[date].filter((item) => item.id !== id),
    };

    setEvents(updatedEvents);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const monthTotalHours = (): number => {
    return timeRegistrationList.reduce((total, item) => total + item.time, 0);
  };

  const isDateInArray = (dateToCheck: string) => {
    return timeRegistrationList.some(
      (registration) => registration.date === dateToCheck
    );
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
          <TotalTime
            type="calendar"
            totalHours={
              filteredData.length > 0 ? totalWorkedHours : monthTotalHours()
            }
          />
          <div className="pr-4 pl-4 mb-6">
            {filteredData.map((item, index) => {
              return (
                <TimeCodeItem
                  data={item}
                  key={index}
                  screen="detailScreen"
                  edit={editTimeRegistration}
                  remove={removeItem}
                />
              );
            })}
          </div>
        </>
      )}

      {!showTRForm && filteredData.length === 0 ? (
        <div className="ml-6 text-md font-semibold text-[#454548]">
          No registrations
        </div>
      ) : (
        <></>
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
