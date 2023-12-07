import { useState, useEffect } from "react";
import Calendar, { TileDisabledFunc } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./EventCalendar.css";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import TotalTime from "../TotalTime/TotalTime";
import { TimeCodeItem } from "../ListProjects/ListOfProjects";
import TimeRegistrationForm from "../AddTimeRegistration/AddTimeRegistration";
import {
  HolidayProps,
  TimeRegistration,
  TimeSheetCodes,
  Times,
  useTimeRegistration,
} from "../../context/TimeRegistrationContext";
import { TimeCodeItemDetail } from "../ListProjects/TimeCodeDetails";
import {
  addTimeSheets,
  addUserTimeRegistration,
  addUserTimeSheetCode,
  editUserTimes,
  getDateLovs,
  getTimeFrameCalendars,
  getTimeSheetRegistration,
  removeUserTimes,
} from "../../api/request";

export interface Event {
  [date: string]: { id: number; name: string; color: string }[];
}

export type TimeRegistrationFormProps = {
  id: number | undefined;
  timeCodeId: number;
  hours: number;
  comments: string;
  date: string;
  dates: string[];
  timeCodeName: string;
  timeFrameName: string;
  organizationName: string;
  timeSheetCodeId: number;
};

type EventProps = {
  showFormBox: boolean;
  onCancel: () => void | undefined;
  from: string | undefined;
  holidays: HolidayProps[];
  data: TimeRegistration | undefined;
  view: string;
};

const EventCalendar: React.FC<EventProps> = ({
  showFormBox,
  onCancel,
  from,
  holidays,
  data,
  view,
}) => {
  const [selecteedDate, setSelecteedDate] = useState<Date>(new Date());

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [showTRForm, setShowTRForm] = useState<boolean>(showFormBox);
  const [events, setEvents] = useState<Event>({});
  const [formData, setFormData] = useState<TimeRegistrationFormProps>({
    id: 0,
    timeCodeId: 0,
    hours: 0,
    comments: "",
    date: "",
    dates: [],
    timeCodeName: "",
    timeFrameName: "",
    organizationName: "",
    timeSheetCodeId: 0,
  });
  const [totalWorkedHours, setTotalWorkedHours] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [navigationData, setNavigationData] = useState<string[]>([]);

  const [filteredData, setFilteredData] = useState<TimeRegistration>();
  const [selectedDate, setSelectedDate] = useState<string>();
  const {
    timeRegistrations,
    showCalendarView,
    timeSheetCodes,
    endDate,
    dataFrameList,
    currentFrameDate,
    setHolidays,
    setMonthTotalHours,
    listTimeRegistration,
    editTimeRegistratrion,
    listSelectedDates,
    setCalendarView,
    getCurrentFrameDate,
  } = useTimeRegistration();

  useEffect(() => {
    const event = (timeRegistrations || data)?.timeSheetCodes?.flatMap(
      (timeSheetCode) => timeSheetCode.times
    );

    event?.forEach((item) => {
      addEvent(new Date(item.date).toLocaleDateString(), item.id);
    });
  }, [timeRegistrations]);

  useEffect(() => {
    setShowTRForm(showFormBox);
  }, [showCalendarView]);

  const onAddNewTR = () => {
    editTimeRegistratrion({
      id: 0,
      timeCodeId: 0,
      timeSheetCodeId: 0,
      timeCode: {
        active: false,
        billable: false,
        id: 0,
        maxTime: 0,
        projectBillable: false,
        totalTime: 0,
        tsCode: "",
      },
      pinned: false,
      timeSheetId: 0,
      times: [],
      totalTime: 0,
    });

    setCalendarView(true);
    setShowTRForm(true);
    setSelectedDates([]);
    listSelectedDates([]);
  };

  const editTimeRegistration = (data: TimeSheetCodes) => {
    setShowTRForm(true);
    listSelectedDates([data?.times[0].date]);
    editTimeRegistratrion(data);
  };

  const removeItem = async (data: TimeSheetCodes): Promise<void> => {
    await removeUserTimes(data.times[0].id);

    const date = data.times[0].date;
    const dataRes = await getDateLovs(
      "TIMEFRAME",
      currentFrameDate?.date || new Date().toDateString(),
      currentFrameDate?.date || new Date().toDateString(),
      2
    );

    const userTimeRegistrationList = await getTimeSheetRegistration(
      35,
      2,
      dataRes.id
    );

    const userTimerRegistration = calculateTotalTime(userTimeRegistrationList);

    const filteredTimeRegistration: TimeRegistration = {
      ...userTimerRegistration,
      timeSheetCodes: userTimerRegistration.timeSheetCodes
        .map((timeSheetCode) => ({
          ...timeSheetCode,
          times: timeSheetCode.times.filter((time) => time.date === date),
        }))
        .filter((item) => item.times.length > 0),
    };

    listTimeRegistration(userTimeRegistrationList);
    setFilteredData(filteredTimeRegistration);
  };

  const parseDate = (date: string) => {
    if (date) {
      const parts = date.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const isoDate = `${year}-${month}-${day}`;
        return new Date(isoDate);
      }
    }
  };

  const handleFormData = async (data: TimeRegistrationFormProps) => {
    let timeSheetCodeId = 0;
    let hasTimeCode = false;

    if (timeRegistrations) {
      hasTimeCode =
        timeRegistrations?.timeSheetCodes?.filter((item) => {
          return item.timeCode.tsCode === data.timeCodeName;
        }).length > 0;

      if (hasTimeCode) {
        timeSheetCodeId = timeRegistrations?.timeSheetCodes?.filter((item) => {
          return item.timeCode.tsCode === data.timeCodeName;
        })[0].id;
      } else {
        let timeSheetId: number = timeRegistrations.id || 0;

        if (Object.keys(timeRegistrations).length === 0) {
          timeSheetId = await addTimeSheets({
            complete: false,
            id: 0,
            organizationId: 2,
            timeFrameId: currentFrameDate?.id,
            userId: 35,
          });
        }

        timeSheetCodeId = await addUserTimeSheetCode({
          id: 0,
          pinned: false,
          timeSheetId: timeSheetId,
          timeCodeId: data.timeCodeId,
        });
      }

      const userTimeRegistrationDetails = {
        id: data.id,
        date: parseDate(
          selectedDates[0] || selectedDate || new Date().toLocaleString()
        )?.toJSON(),
        hours: data.hours,
        projBillable: false,
        tsBillable: false,
        archived: false,
        processed: false,
        timeCodeId: data.timeCodeId,
        timeSheetCodeId: timeSheetCodeId,
        comments: data.comments,
      };

      if (userTimeRegistrationDetails.id !== 0) {
        await editUserTimes(userTimeRegistrationDetails);
      } else {
        const listOfTimes: any[] = [];
        selectedDates.forEach((item) => {
          listOfTimes.push({
            id: data.id,
            date: parseDate(item)?.toJSON(),
            hours: data.hours,
            projBillable: false,
            tsBillable: false,
            archived: false,
            processed: false,
            timeCodeId: data.timeCodeId,
            timeSheetCodeId: timeSheetCodeId,
            comments: data.comments,
          });
        });

        await addUserTimeRegistration(listOfTimes);
      }

      const dataRes = await getDateLovs(
        "TIMEFRAME",
        currentFrameDate?.date || new Date().toDateString(),
        currentFrameDate?.date || new Date().toDateString(),
        2
      );

      const userTimeRegistrationList = await getTimeSheetRegistration(
        35,
        2,
        dataRes.id
      );

      const userTimerRegistration = calculateTotalTime(
        userTimeRegistrationList
      );

      const filteredTimeRegistration: TimeRegistration = {
        ...userTimerRegistration,
        timeSheetCodes: userTimerRegistration.timeSheetCodes
          .map((timeSheetCode) => ({
            ...timeSheetCode,
            times: timeSheetCode.times.filter(
              (time) =>
                time.date.split("T")[0] ===
                parseDate(selectedDates[0])?.toJSON().split("T")[0]
            ),
          }))
          .filter((item) => item.times.length > 0),
      };

      listTimeRegistration(userTimeRegistrationList);
      setFilteredData(filteredTimeRegistration);
    }

    setSelectedDates([]);
    listSelectedDates([]);
    setShowTRForm(false);
    setFormData(data);
  };

  const setDate = (newDate: string) => {
    setFormData((prevData) => ({ ...prevData, date: newDate }));
  };

  const cancelTR = () => {
    editTimeRegistratrion({
      id: 0,
      timeCodeId: 0,
      timeSheetCodeId: 0,
      timeCode: {
        active: false,
        billable: false,
        id: 0,
        maxTime: 0,
        projectBillable: false,
        totalTime: 0,
        tsCode: "",
      },
      pinned: false,
      timeSheetId: 0,
      times: [],
      totalTime: 0,
    });
    setSelectedDates([]);
    listSelectedDates([]);
    setShowTRForm(false);

    if (from === "mainScreen") onCancel();
  };

  const addEvent = (date: string, id: number) => {
    if (!events[date]) {
      events[date] = [];
    }

    events[date].push({ id: id, name: "test", color: getRandomColor() });
    setEvents({ ...events });
  };

  const calculateTotalTime = (
    timeRegistration: TimeRegistration
  ): TimeRegistration => {
    return {
      ...timeRegistration,
      timeSheetCodes: timeRegistration.timeSheetCodes?.map((timeSheetCode) => ({
        ...timeSheetCode,
        totalTime: timeSheetCode.times.reduce(
          (total, time) => total + time.hours,
          0
        ),
      })),
    };
  };

  const handleDateClick = (date: Date) => {
    const formattedDate = date.toLocaleDateString();
    const id = timeSheetCodes?.id || 0;

    if (timeRegistrations) {
      const userTimerRegistration = calculateTotalTime(timeRegistrations);

      const filteredTimes = userTimerRegistration.timeSheetCodes
        ?.flatMap((timeSheetCode) => timeSheetCode.times)
        .filter((item) => {
          return (
            new Date(item.date).toLocaleDateString() ===
            date.toLocaleDateString()
          );
        });

      const filteredTimeRegistration: TimeRegistration = {
        ...userTimerRegistration,
        timeSheetCodes: userTimerRegistration.timeSheetCodes
          ?.map((timeSheetCode) => ({
            ...timeSheetCode,
            times: timeSheetCode.times.filter(
              (time) =>
                new Date(time.date).toLocaleDateString() ===
                date.toLocaleDateString()
            ),
          }))
          .filter((item) => item.times.length > 0),
      };

      setFilteredData(filteredTimeRegistration);

      if (!showTRForm) {
        const totalSum = filteredTimes?.reduce((accumulator, currentItem) => {
          return accumulator + currentItem.hours;
        }, 0);

        setTotalWorkedHours(totalSum);
      }
    }

    if (id === 0) {
      if (!selectedDates.includes(formattedDate) && showTRForm) {
        setSelectedDates([...selectedDates, formattedDate]);
        listSelectedDates([...selectedDates, formattedDate]);
        setDate(formattedDate);
      } else {
        setSelectedDate(formattedDate);
        setSelectedDates(selectedDates.filter((d) => d !== formattedDate));
        listSelectedDates(selectedDates.filter((d) => d !== formattedDate));
      }
    }
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const renderEventCircles = (date: string) => {
    if (timeRegistrations) {
      const eventCount = (events as Event)[date]
        ? (events as Event)[date]?.length
        : 0;

      const filteredTimes = timeRegistrations.timeSheetCodes
        ?.flatMap((timeSheetCode) => timeSheetCode.times)
        .filter((item) => {
          return new Date(item.date).toLocaleDateString() === date;
        });

      const totalSum = filteredTimes?.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.hours;
      }, 0);

      const circleColor = totalSum >= 8 ? "bg-[#1BC800]" : "bg-[#FFD70C]";

      return (
        <div className="event-circles">
          {eventCount > 0 ? (
            <div className={`event-circle ${circleColor}`}></div>
          ) : null}
        </div>
      );
    }
  };

  const allowedMonths: Date[] = [
    new Date(2023, 0), // January 2023
    new Date(2023, 2), // March 2023
    new Date(2023, 5), // June 2023
  ];

  const customTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const isAllowed = allowedMonths.some(
        (allowedDate) =>
          allowedDate.getFullYear() === date.getFullYear() &&
          allowedDate.getMonth() === date.getMonth()
      );
      return isAllowed ? null : <></>; // Hide non-allowed months
    }
    return null;
  };

  const monthTotalHours = (): number => {
    return timeRegistrations
      ? timeRegistrations?.timeSheetCodes?.reduce((total, timeSheetCode) => {
          return (
            total +
            timeSheetCode.times.reduce(
              (codeTotal, time) => codeTotal + time.hours,
              0
            )
          );
        }, 0)
      : 0;
  };

  return (
    <div className="w-full flex flex-col">
      <Calendar
        //   value={selecteedDate}
        defaultView="month"
        minDetail="month"
        maxDetail="month"
        locale="en"
        // navigationLabel={CustomNavigationLabel}
        showNeighboringMonth={false}
        className={view === "calendar" ? "show_calendar" : "hide_calendar"}
        maxDate={new Date(endDate ? endDate : "")}
        nextLabel={<FaChevronRight />}
        prevLabel={<FaChevronLeft />}
        onClickDay={handleDateClick}
        // tileDisabled={tileDisabled}
        onActiveStartDateChange={async ({ activeStartDate }) => {
          console.log("active", activeStartDate);
          const data = await getDateLovs(
            "TIMEFRAME",
            activeStartDate?.toDateString() || new Date().toDateString(),
            activeStartDate?.toDateString() || new Date().toDateString(),
            2
          );

          const userTimeRegistrationList = await getTimeSheetRegistration(
            35,
            2,
            data.id
          );
          const response = await getTimeFrameCalendars(data.id, 2);

          getCurrentFrameDate({
            id: data.id,
            date: data.value,
          });

          if (Object.keys(userTimeRegistrationList).length !== 0) {
            const totalHours = userTimeRegistrationList.timeSheetCodes.reduce(
              (total, timeSheetCode) => {
                return (
                  total +
                  timeSheetCode.times.reduce(
                    (codeTotal, time) => codeTotal + time.hours,
                    0
                  )
                );
              },
              0
            );

            setMonthTotalHours(totalHours | 0);
            listTimeRegistration(userTimeRegistrationList);
          } else {
            setMonthTotalHours(0);
          }

          setHolidays(response || []);
          listTimeRegistration(userTimeRegistrationList);
        }}
        tileClassName={({ date }) => {
          let classNames = "";

          holidays.forEach((item) => {
            if (
              new Date(item.date).toLocaleDateString() ===
              date.toLocaleDateString()
            ) {
              classNames += " static-day-class";
            } else {
              classNames += ``;
            }
          });

          if (selectedDates.includes(date.toLocaleDateString())) {
            classNames += " selected";
          }

          if (selectedDate === date.toLocaleDateString()) {
            classNames += " selected_active";
          } else {
            classNames += "";
          }

          return classNames;
        }}
        tileContent={({ date }) =>
          renderEventCircles(date.toLocaleDateString())
        }
      />
      {view === "calendar" ? (
        <>
          <div className="flex flex-row pl-6 mt-4 mb-4">
            <div className="flex flex-row text-xs">
              {holidays.map((item) => {
                return (
                  <div className="mr-4">
                    <span className="text-[#1C85E8] font-semibold">
                      {new Date(item.date).getDate()} -{" "}
                    </span>
                    <span className="text-[black] font-semibold">
                      {item.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {showTRForm && showCalendarView ? (
        <TimeRegistrationForm
          showForm={showTRForm}
          data={events}
          onCancel={() => cancelTR()}
          onSubmit={handleFormData}
          formData={formData}
          timeSheet={timeRegistrations ? timeRegistrations?.timeSheetCodes : []}
        />
      ) : (
        <>
          {showCalendarView ? (
            <>
              <TotalTime type="calendar" totalHours={monthTotalHours()} />
              <div className="pr-4 pl-4 mb-6">
                {filteredData?.timeSheetCodes?.map((item, index) => {
                  return (
                    <TimeCodeItemDetail
                      data={item}
                      timeResgistration={timeRegistrations?.timeSheetCodes}
                      date={selectedDate}
                      key={index}
                      totalTime={0}
                      screen="detailScreen"
                      edit={editTimeRegistration}
                      remove={removeItem}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      )}

      {!showTRForm && filteredData?.timeSheetCodes?.length === 0 ? (
        <div className="ml-6 text-md font-semibold text-[#454548]">
          No registrations
        </div>
      ) : (
        <></>
      )}

      {!showTRForm && showCalendarView ? (
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
