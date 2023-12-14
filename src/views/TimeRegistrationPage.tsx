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
import LoadingSpinner from "../components/Loading/LoadingSpinner";

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

const urlParams = new URLSearchParams(window.location.search);
const organizationId = urlParams.get("organizationId");
const userId = urlParams.get("userId");

const TimeRegistraionPage: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showFormBox, setshowFormBox] = useState<boolean>(false);
  const [pathfrom, setPathFrom] = useState<string>();
  const [hasRecords, setHasRecords] = useState<boolean>(true);
  const [allowedMonths, setAllowedMonths] = useState<Date[]>();

  const {
    timeRegistrations,
    showCalendarView,
    holidaysList,
    dataFrameList,
    currentFrameDate,
    lastFrameDate,
    firstFrameDate,
    totalHours,
    isLoading,
    setIsLoadingData,
    setFilteredData,
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
      if (ele.currentTarget.getAttribute("datatype") === "calendarView") {
        let elementSelectedActive =
          document.getElementsByClassName("selected_active");
        let elementSelected = document.getElementsByClassName("selected");

        if (elementSelectedActive.length > 0)
          elementSelectedActive[0].classList.remove("selected_active");
        if (elementSelected.length > 0)
          elementSelected[0].classList.remove("selected");

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

        setCalendarView(false);
        setShowCalendar(false);
        setshowFormBox(false);
      } else {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage("closeWebView"); // Or any message indicating the action
        }
      }
    };

    const addEventListener = () => {
      const button = document.getElementById("backBtn");
      if (button) {
        button.addEventListener("click", handleButtonClick);
      }
    };

    const removeEventListener = () => {
      const button = document.getElementById("backBtn");
      if (button) {
        button.removeEventListener("click", handleButtonClick);
      }
    };

    addEventListener();

    return () => {
      removeEventListener();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const data = await getLovsDropdown("TIMEFRAME", false, true);
        const first = data[0];
        const last = data[data.length - 1];

        getFirstFrameDate({ id: first.id, date: first.value });
        getLastFrameDate({ id: last.id, date: last.value });

        const dataFrame: DataFrameDateProps[] = [];
        const allowedMonthsList: Date[] = [];

        data.forEach((item) => {
          dataFrame.push({
            id: item.id,
            date: item.value,
          });

          allowedMonthsList.push(new Date(item.value));
        });

        setAllowedMonths(allowedMonthsList);

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
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
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
    setIsLoadingData(true);

    const nextTimeFrame: DataFrameDateProps | undefined = findNextObjectById(
      dataFrameList || [],
      currentFrameDate?.id || 0
    );

    if (nextTimeFrame) {
      const params = {
        timeSheetId: timeRegistrations?.id,
        nextTimeFrameId: nextTimeFrame?.id, // 505,
      };

      try {
        const respones = await fowardUserPins(params);
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsLoadingData(false);
      }
    }
  };

  const onCompleteTimeSheet = async () => {
    setIsLoadingData(true);

    const data = {
      complete: true,
      id: timeRegistrations?.id,
      organizationId: organizationId || 2,
      timeFrameId: timeRegistrations?.timeFrameId,
      userId: userId || 35,
    };

    try {
      await completeTimeSheets(data);

      const dataRes = await getDateLovs(
        "TIMEFRAME",
        currentFrameDate?.date || new Date().toDateString(),
        currentFrameDate?.date || new Date().toDateString()
      );

      const userTimeRegistrationList = await getTimeSheetRegistration(
        dataRes.id
      );
      listTimeRegistration(userTimeRegistrationList);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const onCancel = () => {
    setShowCalendar(false);
    setCalendarView(false);
    setshowFormBox(false);
    setAppWebViewState("MainView");
  };

  const removeItem = async (id: number): Promise<void> => {
    setIsLoadingData(true);

    try {
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
    } catch (error) {
    } finally {
      setIsLoadingData(false);
    }
  };

  return (
    <div>
      <TopBar
        title={"Time Registration"}
        view={showCalendar ? "calendarView" : "mainView"}
      />

      {isLoading && <LoadingSpinner />}

      <div className="w-full mt-16 min-h-max flex flex-row justify-end border-b-indigo-500">
        <div className="calendar-container w-full flex flex-col items-center">
          <div className="calendar-view w-full flex flex-col ">
            {/* <SpecificMonthsCalendar allowedMonths={allowedMonths} />*/}

            {dataFrameList &&
              dataFrameList.length > 0 &&
              allowedMonths &&
              allowedMonths.length > 0 && (
                <EventCalendar
                  view={showCalendar ? "calendar" : ""}
                  data={timeRegistrations}
                  holidays={holidaysList || []}
                  showFormBox={showFormBox}
                  onCancel={() => onCancel()}
                  from={pathfrom}
                  allowedMonths={allowedMonths || []}
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
                      {totalHours?.toFixed(1) || 0}
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
                      style={
                        timeRegistrations?.complete
                          ? styles.btnButtonDisabled
                          : styles.btnNewTR
                      }
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
