import { useState, useEffect, useContext, useRef } from "react";
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
import { format, isValid, parse, fromUnixTime } from "date-fns";
import { SessionContext } from "../../context/SessionContext";

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
  allowedMonths: Date[];
};

const EventCalendar: React.FC<EventProps> = ({
  showFormBox,
  onCancel,
  from,
  holidays,
  data,
  view,
  allowedMonths,
}) => {
  const [selecteedDate, setSelecteedDate] = useState<Date>(new Date());

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [showTRForm, setShowTRForm] = useState<boolean>(showFormBox);
  //const [events, setEvents] = useState<Event>({});
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
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(
    allowedMonths.length - 1
  );

  const [selectedDate, setSelectedDate] = useState<string>();
  const {
    timeRegistrations,
    showCalendarView,
    timeSheetCodes,
    endDate,
    currentFrameDate,
    filteredData,
    events,
    setMonthEvents,
    setIsLoadingData,
    setFilteredData,
    setHolidays,
    setMonthTotalHours,
    listTimeRegistration,
    editUserTimeRegistratrion,
    listSelectedDates,
    setCalendarView,
    getCurrentFrameDate,
  } = useTimeRegistration();

  const { userId, orgId, token } = useContext(SessionContext);

  useEffect(() => {
    const event = (timeRegistrations || data)?.timeSheetCodes?.flatMap(
      (timeSheetCode) => timeSheetCode.times
    );

    console.log("endDate", endDate);

    event?.forEach((item) => {
      addEvent(new Date(item.date).toLocaleDateString(), item.id);
    });
  }, [timeRegistrations]);

  useEffect(() => {
    setShowTRForm(showFormBox);
  }, [showCalendarView]);

  const onAddNewTR = () => {
    editUserTimeRegistratrion({
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

  const editTimeRegistration = (data: Times) => {
    setShowTRForm(true);
    let editObject: TimeSheetCodes = {
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
    };

    if (editObject !== undefined && filteredData !== undefined) {
      editObject = filteredData.timeSheetCodes.filter((sheetCode) => {
        if (sheetCode.id === data.timeSheetCodeId) {
          sheetCode.times.filter((item) => {
            if (item.date === data.date) sheetCode.times = [data];
          });

          return sheetCode;
        }
      })[0];

      editUserTimeRegistratrion(editObject);
      listSelectedDates([data?.date]);
    }
  };

  const removeItem = async (data: Times): Promise<void> => {
    setIsLoadingData(true);

    try {
      await removeUserTimes(data.id, token || "");
      setMonthEvents({});

      const date = data.date;
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

      const userTimerRegistration = calculateTotalTime(
        userTimeRegistrationList
      );

      const filteredTimeRegistration: TimeRegistration = {
        ...userTimerRegistration,
        timeSheetCodes: userTimerRegistration.timeSheetCodes
          .map((timeSheetCode) => ({
            ...timeSheetCode,
            times: timeSheetCode.times.filter((time) => time.date === date),
          }))
          .filter((item) => item.times.length > 0),
      };

      let totalHours = 0;
      if (Object.keys(userTimeRegistrationList).length !== 0) {
        totalHours = userTimeRegistrationList.timeSheetCodes.reduce(
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
      }
      setMonthTotalHours(totalHours | 0);

      listTimeRegistration(userTimeRegistrationList);
      setFilteredData(filteredTimeRegistration);
    } catch (error) {
    } finally {
      setIsLoadingData(false);
    }
  };

  const parseDate = (dateString: string): Date | null => {
    let parsedDate: Date | null = null;

    const formatsToTry: string[] = [
      "dd/MM/yyyy",
      "MM/dd/yyyy",
      "yyyy/MM/dd",
      "yyyy/dd/MM",
    ];

    for (const format of formatsToTry) {
      parsedDate = parse(dateString, format, new Date());

      if (isValid(parsedDate)) {
        break;
      }
    }

    if (!isValid(parsedDate)) {
      parsedDate = null;
    }

    return parsedDate;
  };

  const formatDate = (dateString: string): Date | null => {
    const formatsToTry: string[] = [
      "dd/MM/yyyy",
      "MM/dd/yyyy",
      "yyyy/MM/dd",
      "yyyy/dd/MM",
    ];

    for (const format of formatsToTry) {
      const parsedDate = new Date(
        dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")
      );

      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }

    return null; // Return null if none of the formats match or parsing fails
  };

  const formatDateWithFormat = (date: Date, format: string): string | null => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "UTC",
      };

      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date
      );
      return formattedDate;
    } catch (error) {
      console.error(`Error formatting date: ${error}`);
      return null;
    }
  };

  const handleFormData = async (data: TimeRegistrationFormProps) => {
    let timeSheetCodeId = 0;
    let hasTimeCode = false;
    let lastSelectedDate = selectedDates[selectedDates.length - 1];
    let totalHours = 0;

    try {
      setIsLoadingData(true);

      if (timeRegistrations) {
        hasTimeCode =
          timeRegistrations?.timeSheetCodes?.filter((item) => {
            return item.timeCode.tsCode === data.timeCodeName;
          }).length > 0;

        if (hasTimeCode) {
          const insertList: any = {};
          const repeatedTimeCodes: string[] = [];

          console.log(
            "aquiiii",
            timeRegistrations?.timeSheetCodes?.filter((item) => {
              if (item.timeCode.tsCode === data.timeCodeName) {
                selectedDates.forEach((elt) => {
                  const parsedDate = formatDate(elt) || new Date();
                  const formattedDate = format(
                    parsedDate,
                    "yyyy-MM-dd'T'HH:mm:ss"
                  );
                  item.times.map((time) => {
                    if (formattedDate === time.date) {
                      console.log(time);
                      return time;
                    }
                  });
                });

                return item.times;
              }
            })
          );

          timeRegistrations?.timeSheetCodes?.forEach((item) => {
            if (item.timeCode.tsCode === data.timeCodeName) {
              selectedDates.forEach((elt) => {
                const parsedDate = formatDate(elt) || new Date();
                const formattedDate = format(
                  parsedDate,
                  "yyyy-MM-dd'T'HH:mm:ss"
                );
                item.times.forEach((time) => {
                  if (formattedDate === time.date) {
                    console.log(time);
                    repeatedTimeCodes.push(time.date);
                  }

                  if (formattedDate !== time.date) {
                    console.log("insert item", item, formattedDate, time.date);
                  }
                });
              });
            }
          });

          console.log("repeated", repeatedTimeCodes);
          console.log("insert", insertList);

          timeSheetCodeId = timeRegistrations?.timeSheetCodes?.filter(
            (item) => {
              return item.timeCode.tsCode === data.timeCodeName;
            }
          )[0].id;
        } else {
          let timeSheetId: number = timeRegistrations.id || 0;

          if (Object.keys(timeRegistrations).length === 0) {
            timeSheetId = await addTimeSheets(
              {
                complete: false,
                id: 0,
                organizationId: orgId,
                timeFrameId: currentFrameDate?.id,
                userId: userId,
              },
              token || ""
            );
          }

          timeSheetCodeId = await addUserTimeSheetCode(
            {
              id: 0,
              pinned: false,
              timeSheetId: timeSheetId,
              timeCodeId: data.timeCodeId,
            },
            token || ""
          );
        }

        const userTimeRegistrationDetails = {
          id: data.id,
          date: formatDate(
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
          await editUserTimes(userTimeRegistrationDetails, token || "");
        } else {
          const listOfTimes: any[] = [];
          selectedDates.forEach((item) => {
            const parsedDate = formatDate(item) || new Date();
            const formattedDate = format(
              parsedDate,
              "yyyy-MM-dd'T'HH:mm:ss.SSS"
            );

            listOfTimes.push({
              id: data.id,
              date: formattedDate,
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

          await addUserTimeRegistration(listOfTimes, token || "");
        }

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
                  formatDate(selectedDates[0])?.toJSON().split("T")[0]
              ),
            }))
            .filter((item) => item.times.length > 0),
        };

        if (Object.keys(userTimeRegistrationList).length !== 0) {
          totalHours = userTimeRegistrationList.timeSheetCodes.reduce(
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
        }

        setSelectedDates([lastSelectedDate]);
        setMonthTotalHours(totalHours | 0);
        listSelectedDates([lastSelectedDate]);

        listTimeRegistration(userTimeRegistrationList);
        setFilteredData(filteredTimeRegistration);
      }
      setShowTRForm(false);
      setFormData(data);
    } catch (error) {
    } finally {
      setIsLoadingData(false);
    }
  };

  const setDate = (newDate: string) => {
    setFormData((prevData) => ({ ...prevData, date: newDate }));
  };

  const cancelTR = () => {
    editUserTimeRegistratrion({
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
    if (events) {
      if (!events[date]) {
        events[date] = [];
      }

      events[date].push({ id: id, name: "test", color: getRandomColor() });
      setMonthEvents({ ...events });
    }
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

  const handlePreviousMonth = () => {
    setCurrentMonthIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );

    console.log(
      "{allowedMonths[currentMonthIndex]",
      allowedMonths[currentMonthIndex]
    );
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prevIndex) =>
      prevIndex < allowedMonths.length - 1 ? prevIndex + 1 : prevIndex
    );

    console.log(
      "{allowedMonths[currentMonthIndex]",
      allowedMonths[currentMonthIndex]
    );
  };

  const handleCustomNext = () => {
    handleNextMonth();
  };

  const handleCustomPrevious = () => {
    // Custom function for previous button functionality
    handlePreviousMonth();
  };

  return (
    <div className="w-full flex flex-col mt-1">
      <Calendar
        // value={allowedMonths[currentMonthIndex]}
        value={new Date()}
        defaultView="month"
        minDetail="month"
        locale="en"
        showNeighboringMonth={false}
        className={view === "calendar" ? "show_calendar" : "hide_calendar"}
        maxDate={new Date(endDate ? endDate : "")}
        nextLabel={<FaChevronRight />}
        prevLabel={<FaChevronLeft />}
        onClickDay={handleDateClick}
        selectRange={false}
        // tileDisabled={tileDisabled}
        onActiveStartDateChange={async ({ activeStartDate }) => {
          console.log("ative", activeStartDate);
          setIsLoadingData(true);
          setFilteredData({
            complete: false,
            id: 0,
            organizationId: 0,
            timeFrameId: 0,
            timeFrameLov: {
              id: 0,
              value: "",
              startDate: "",
              endDate: "",
            },
            timeSheetCodes: [],
            userId: 0,
          });
          try {
            const data = await getDateLovs(
              orgId || 0,
              "TIMEFRAME",
              activeStartDate?.toDateString() || new Date().toDateString(),
              activeStartDate?.toDateString() || new Date().toDateString(),
              token || ""
            );

            const userTimeRegistrationList = await getTimeSheetRegistration(
              orgId || 0,
              userId || 0,
              data.id,
              token || ""
            );
            const response = await getTimeFrameCalendars(
              orgId || 0,
              data.id,
              token || ""
            );

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
            } else {
              setMonthTotalHours(0);
            }
            setHolidays(response || []);
            listTimeRegistration(userTimeRegistrationList);
          } catch (error) {
          } finally {
            setIsLoadingData(false);
          }
        }}
        tileClassName={({ date }) => {
          let classNames = "";
          const formattedDate = date.toLocaleDateString();

          holidays.forEach((item) => {
            if (new Date(item.date).toLocaleDateString() === formattedDate) {
              classNames += " static-day-class";
            } else {
              classNames += ``;
            }
          });

          if (
            selectedDates.includes(formattedDate) &&
            showTRForm &&
            !classNames.includes("selected")
          ) {
            classNames += " selected";
          } else {
            classNames += "";
          }

          if (selectedDate === formattedDate && !showTRForm) {
            classNames += " selected_active";
          } else {
            classNames += "";
          }

          if (
            selectedDate === formattedDate &&
            timeSheetCodes?.id != 0 &&
            showTRForm
          ) {
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
        <div>
          <div className="flex pl-4 mt-4 mb-4 pr-4">
            <div className="flex flex-col  text-xs">
              {holidays.map((item) => {
                return (
                  <div className="mb-2">
                    <span className="text-[#1C85E8] font-semibold">
                      {new Date(item.date).getDate()}{" "}
                    </span>
                    <span className="text-[black] font-semibold">
                      - {item.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {showTRForm && showCalendarView ? (
        <TimeRegistrationForm
          showForm={showTRForm}
          data={events || {}}
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
      {!showTRForm &&
      filteredData?.timeSheetCodes?.length === 0 &&
      showCalendarView ? (
        <div className="ml-6 text-base font-semibold text-[#454548]">
          No registrations
        </div>
      ) : (
        <></>
      )}
      {!showTRForm && showCalendarView && !timeRegistrations?.complete ? (
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
