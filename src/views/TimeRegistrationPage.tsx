import { useEffect, useState } from "react";
import { MonthYear } from "../components/MonthYear/MonthYear";
import CustomButton from "../components/CustomButton/CustomButton";
import { FaThumbtack, FaPlus } from "react-icons/fa";
import { TimeCodeItem } from "../components/ListProjects/ListOfProjects";
import EventCalendar from "../components/EventCalendar/EventCalendar";
import {
  completeTimeSheets,
  fowardUserPins,
  getDateLovs,
  getLovsDropdown,
  getTimeFrameCalendars,
  getTimeSheetRegistration,
  pinnedUserTimeSheetCode,
  removeUserTimeSheetCodes,
} from "../api/request";
import {
  DataFrameDateProps,
  HolidayProps,
  TimeRegistration,
  useTimeRegistration,
} from "../context/TimeRegistrationContext";
import SpecificMonthsCalendar from "../components/EventCalendar/SpecificMonthsCalendar";
import TopBar from "../components/TopBar/TopBar";

export type MonthData = {
  id: number;
  parentId?: null;
  reference?: null;
  translations?: any[];
  value: string;
};

export type DateLov = {
  endDate: string;
  id: number;
  startDate: string;
  value: string;
};

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (data: string) => void;
    };
  }
}

const TimeRegistraionPage: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showFormBox, setshowFormBox] = useState<boolean>(false);
  const [pathfrom, setPathFrom] = useState<string>();
  const [hasRecords, setHasRecords] = useState<boolean>(true);

  const {
    timeRegistrations,
    showCalendarView,
    holidaysList,
    dataFrameList,
    currentFrameDate,
    lastFrameDate,
    firstFrameDate,
    totalHours,
    setAppWebViewState,
    setMonthTotalHours,
    setCalendarView,
    listTimeRegistration,
    setDates,
    getCurrentFrameDate,
    getFirstFrameDate,
    getLastFrameDate,
    setDateFrameList,
    setHolidays,
  } = useTimeRegistration();

  useEffect(() => {
    const handleButtonClick = (ele: any) => {
      console.log("ele", ele);

      // Post a message when the button inside the WebView is clicked
      if (ele.currentTarget.getAttribute("datatype") === "calendarView") {
        setCalendarView(false);
        setShowCalendar(false);
        setshowFormBox(false);
      } else {
        console.log("Exit");
      }

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage("closeWebView"); // Or any message indicating the action
      }
    };

    const addEventListener = () => {
      const button = document.getElementById("yourButtonId");
      if (button) {
        button.addEventListener("click", handleButtonClick);
      }
    };

    const removeEventListener = () => {
      const button = document.getElementById("yourButtonId");
      if (button) {
        button.removeEventListener("click", handleButtonClick);
      }
    };

    addEventListener(); // Add event listener when component mounts

    return () => {
      removeEventListener(); // Clean up event listener when component unmounts
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLovsDropdown("TIMEFRAME", false, true);
        const first = data[0];
        const last = data[data.length - 1];

        getFirstFrameDate({ id: first.id, date: first.value });
        getLastFrameDate({ id: last.id, date: last.value });

        const dataFrame: DataFrameDateProps[] = [];
        data.forEach((item) => {
          dataFrame.push({
            id: item.id,
            date: item.value,
          });
        });

        const dataLovs = await getDateLovs(
          "TIMEFRAME",
          currentFrameDate?.date || new Date().toDateString(),
          currentFrameDate?.date || new Date().toDateString()
        );

        const userTimeRegistrationList: TimeRegistration =
          await getTimeSheetRegistration(dataLovs.id);
        setDates(dataLovs.startDate, dataLovs.endDate);

        getCurrentFrameDate({
          id:
            Object.keys(userTimeRegistrationList).length > 0
              ? userTimeRegistrationList.timeFrameId
              : lastFrameDate?.id || 0,
          date:
            Object.keys(userTimeRegistrationList).length > 0
              ? userTimeRegistrationList.timeFrameLov.value
              : lastFrameDate?.date || "",
        });

        console.log("current", currentFrameDate);

        const totalHours =
          Object.keys(userTimeRegistrationList).length > 0
            ? userTimeRegistrationList?.timeSheetCodes.reduce(
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
              )
            : 0;

        setMonthTotalHours(totalHours | 0);
        listTimeRegistration(userTimeRegistrationList);

        const response = await getTimeFrameCalendars(dataLovs.id);
        setHolidays(response);

        setDateFrameList(dataFrame);
      } catch (error) {
        console.log("error", error);
      }
    };

    const fetchHolidays = async () => {
      try {
      } catch (error) {}
    };

    fetchData();
    fetchHolidays();
  }, []);

  const findNextObjectById = (
    list: DataFrameDateProps[],
    targetId: number
  ): DataFrameDateProps | undefined => {
    const index = list.findIndex((obj) => obj.id === targetId);

    if (index !== -1 && index < list.length - 1) {
      return list[index + 1];
    }

    return undefined;
  };

  const onShowCalendar = () => {
    setShowCalendar(true);
    setCalendarView(true);
    setPathFrom("calendarScreen");
  };

  const onShowFormBox = () => {
    setshowFormBox(true);
    setShowCalendar(true);
    setCalendarView(true);
    setPathFrom("mainScreen");
  };

  const onShowPinned = async () => {
    const nextTimeFrame: DataFrameDateProps | undefined = findNextObjectById(
      dataFrameList || [],
      currentFrameDate?.id || 0
    );

    if (nextTimeFrame) {
      const params = {
        timeSheetId: timeRegistrations?.id,
        nextTimeFrameId: nextTimeFrame?.id, // 505,
      };

      const respones = await fowardUserPins(params);
    } else {
      alert("");
    }
  };

  const onCompleteTimeSheet = async () => {
    const data = {
      complete: true,
      id: timeRegistrations?.id,
      organizationId: 2,
      timeFrameId: timeRegistrations?.timeFrameId,
      userId: 35,
    };

    await completeTimeSheets(data);

    const dataRes = await getDateLovs(
      "TIMEFRAME",
      currentFrameDate?.date || new Date().toDateString(),
      currentFrameDate?.date || new Date().toDateString()
    );

    const userTimeRegistrationList = await getTimeSheetRegistration(dataRes.id);
    listTimeRegistration(userTimeRegistrationList);
  };

  const onCancel = () => {
    setShowCalendar(false);
    setCalendarView(false);
    setshowFormBox(false);
    setAppWebViewState("MainView");
  };

  const removeItem = async (id: number): Promise<void> => {
    await removeUserTimeSheetCodes(id, true);

    const data = await getDateLovs(
      "TIMEFRAME",
      currentFrameDate?.date || new Date().toDateString(),
      currentFrameDate?.date || new Date().toDateString()
    );

    const userTimeRegistrationList = await getTimeSheetRegistration(data.id);

    listTimeRegistration(userTimeRegistrationList);

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
  };

  const allowedMonths: Date[] = [
    new Date(2023, 0), // January 2023
    new Date(2023, 2), // March 2023
    new Date(2023, 5), // June 2023
  ];

  return (
    <div>
      <TopBar
        title={"Time Registration"}
        view={showCalendar ? "calendarView" : "mainView"}
      />

      <div className="w-full mt-14 min-h-max flex flex-row just">
        <div className="calendar-container w-full flex flex-col items-center">
          <div className="calendar-view w-full flex flex-col ">
            {/* <SpecificMonthsCalendar allowedMonths={allowedMonths} />*/}

            {dataFrameList && dataFrameList.length > 0 && (
              <EventCalendar
                view={showCalendar ? "calendar" : ""}
                data={timeRegistrations}
                holidays={holidaysList || []}
                showFormBox={showFormBox}
                onCancel={() => onCancel()}
                from={pathfrom}
              />
            )}
            {!showCalendar ? (
              <>
                <div className="w-full flex flex-col mt-4  mb-2 pr-4 pl-4">
                  <CustomButton
                    color="green"
                    text={"Overview Calendar >"}
                    style={styles.overViewBtn}
                    onClick={() => onShowCalendar()}
                  />
                </div>
                {hasRecords ? (
                  <div className="pr-4 pl-4">
                    {timeRegistrations?.timeSheetCodes?.map((item, index) => {
                      return (
                        <TimeCodeItem
                          data={item}
                          key={item.id}
                          screen="mainScreen"
                          edit={() => console.log("edit from main page")}
                          remove={() => removeItem(item.id)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}

                <div className="total-container pr-4 pl-4 mb-8 mt-2 w-full justify-between">
                  <div className="w-full flex flex-row justify-between font-semibold p-2 pr-4 pl-4 bg-white mb-2 rounded-md">
                    <span className=" text-[#0B2E5F]  text-lg ">
                      Total Work Hours:
                    </span>
                    <span className=" text-[#0B2E5F]  text-lg">
                      {totalHours || 0}
                    </span>
                  </div>
                  <div className="w-full flex flex-row font-semibold justify-between p-2  pr-4 pl-4  bg-white rounded-md">
                    <span className=" text-[#0B2E5F] text-lg">
                      Total Work Days:
                    </span>
                    <span className=" text-[#0B2E5F] text-lg">
                      {totalHours ? (totalHours / 8).toFixed(1) : 0}
                    </span>
                  </div>
                </div>
                <div className="calendar-btn-container flex flex-col w-full pl-4 pr-4">
                  <div className="flex w-full flex-col mb-3">
                    <CustomButton
                      color="green"
                      disable={timeRegistrations?.complete}
                      text={"NEW TIME REGISTRATION"}
                      icon={<FaPlus />}
                      style={styles.btnNewTR}
                      onClick={() => onShowFormBox()}
                    />
                  </div>
                  <div className="flex w-full flex-col mb-3">
                    <CustomButton
                      text="IMPORT PINS"
                      color="blue"
                      style={styles.btnImportPins}
                      icon={<FaThumbtack />}
                      onClick={() => onShowPinned()}
                    />
                  </div>

                  <div className={`flex w-full flex-col mb-3`}>
                    <CustomButton
                      disable={timeRegistrations?.complete}
                      text="COMPLETE TIMESHEET"
                      color="blue"
                      style={
                        timeRegistrations?.complete
                          ? styles.btnButtonDisabled
                          : styles.btnImportPins
                      }
                      onClick={() => onCompleteTimeSheet()}
                    />
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overViewBtn: {
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    color: "#1C85E8",
    fontWeight: "bold",
  },
  btnButtonDisabled: {
    color: "white",
    background: "#ABABAB 0% 0% no-repeat padding-box",
  },
  btnImportPins: {
    background: "#0B2E5F 0% 0% no-repeat padding-box",
    color: "white",
  },
  btnNewTR: {
    background: "#1C85E8 0% 0% no-repeat padding-box",
    color: "white",
  },
};

export default TimeRegistraionPage;
