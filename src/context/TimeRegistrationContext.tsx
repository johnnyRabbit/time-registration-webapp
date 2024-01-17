// TimeRegistrationContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { Event } from "../components/EventCalendar/EventCalendar";

export type TimeRegistration = {
  complete: boolean;
  id: number;
  organizationId: number;
  timeFrameId: number;
  timeFrameLov: {
    id: number;
    value: string;
    startDate: string;
    endDate: string;
  };
  timeSheetCodes: TimeSheetCodes[];
  userId: number;
};

export type TimeSheetCodes = {
  id: number;
  timeCodeId: number;
  timeSheetCodeId: number;
  timeCode: TimeCodes;
  pinned: boolean;
  timeSheetId: number;
  times: Times[];
  totalTime: number;
};

export type Times = {
  archived: boolean;
  comments: string;
  date: string;
  hours: number;
  id: number;
  projBillable: boolean;
  timeCodeId: number;
  timeSheetCodeId: number;
  tsBillable: boolean;
};

export type TimeCodes = {
  active: boolean;
  billable: boolean;
  id: number;
  maxTime: number;
  projectBillable: boolean;
  totalTime: number;
  tsCode: string;
};

export type HolidayProps = {
  id: number;
  description: string;
  date: string;
  color: string;
};

type HolidayColor = {
  id: number;
  value: string;
  color: string;
};

type UserProps = {
  id: number;
  organizationId: number;
  token: string;
};

type TimeCodesProps = {
  id: number;
  tsCode: string;
};

type UrlProps = {
  token: string;
  userId: number;
  organizationId: number;
};

export type TimeFramCalendar = {
  timeFrameId: number;
  organizationId: number;
};

export type TimeSheetCodeProps = {
  id: number;
  pinned: boolean;
  timeSheetId: number;
  timeCodeId: number;
};

export type DataFrameDateProps = {
  id: number;
  date: string;
};

type TimeRegistrationContextType = {
  events: Event | undefined;
  isLoading: boolean | undefined;
  selectedDates: string[] | undefined;
  urlParams: UrlProps | undefined;
  token: string | undefined;
  timeRegistrations: TimeRegistration | undefined;
  filteredData: TimeRegistration | undefined;
  timeSheetCodes: TimeSheetCodes | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  showCalendarView: boolean | undefined;
  currentFrameDate: DataFrameDateProps | undefined;
  firstFrameDate: DataFrameDateProps | undefined;
  lastFrameDate: DataFrameDateProps | undefined;
  dataFrameList: DataFrameDateProps[] | undefined;
  holidaysList: HolidayProps[] | undefined;
  totalHours: number | undefined;
  appState: string | undefined;
  setDateFrameList: (dataFrameList: DataFrameDateProps[]) => void;
  getFirstFrameDate: (dateFrame: DataFrameDateProps) => void;
  getLastFrameDate: (dateFrame: DataFrameDateProps) => void;
  getCurrentFrameDate: (dateFrame: DataFrameDateProps) => void;
  listTimeRegistration: (registration: TimeRegistration) => void;
  editUserTimeRegistratrion: (registration: TimeSheetCodes) => void;
  listSelectedDates: (dates: string[]) => void;
  setDates: (startDate: string, endDate: string) => void;
  setCalendarView: (view: boolean) => void;
  setHolidays: (holidays: HolidayProps[]) => void;
  setMonthTotalHours: (hours: number) => void;
  setAppWebViewState: (state: string) => void;
  setFilteredData: (registration: TimeRegistration) => void;
  setIsLoadingData: (loading: boolean) => void;
  setMonthEvents: (event: Event) => void;
};

const TimeRegistrationContext = createContext<
  TimeRegistrationContextType | undefined
>(undefined);

export function useTimeRegistration() {
  const context = useContext(TimeRegistrationContext);
  if (!context) {
    throw new Error(
      "useTimeRegistration must be used within a TimeRegistrationProvider"
    );
  }
  return context;
}

type TimeRegistrationProviderProps = {
  children: ReactNode;
};

export function TimeRegistrationProvider({
  children,
}: TimeRegistrationProviderProps) {
  const [timeRegistrations, setTimeRegistrations] =
    useState<TimeRegistration>();

  const [urlParams, setUrlParams] = useState<UrlProps>();
  const [token, setToken] = useState<string>();
  const [timeSheetCodes, setTimeSheetCodes] = useState<TimeSheetCodes>();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndtDate] = useState<string>();
  const [showCalendarView, setShowCalendar] = useState<boolean>();
  const [currentFrameDate, setCurrentFrameDate] =
    useState<DataFrameDateProps>();
  const [firstFrameDate, setFirstFrameDate] = useState<DataFrameDateProps>();
  const [lastFrameDate, setLastFrameDate] = useState<DataFrameDateProps>();
  const [dataFrameList, setDateList] = useState<DataFrameDateProps[]>();
  const [holidaysList, setHolidaysList] = useState<HolidayProps[]>();
  const [totalHours, setTotalHours] = useState<number>();
  const [appState, setAppState] = useState<string>();
  const [filteredData, setFilteredTimeRegistration] =
    useState<TimeRegistration>();

  const [isLoading, setIsLoading] = useState<boolean>();
  const [events, setEvents] = useState<Event>({});

  const setMonthEvents = (event: Event) => {
    setEvents(event);
  };

  const setIsLoadingData = (loading: boolean) => {
    setIsLoading(loading);
  };

  const setFilteredData = (registration: TimeRegistration) => {
    setFilteredTimeRegistration(registration);
  };

  const editUserTimeRegistratrion = (timeSheetCodes: TimeSheetCodes) => {
    setTimeSheetCodes(timeSheetCodes);
  };

  const listTimeRegistration = (registration: TimeRegistration) => {
    setTimeRegistrations(registration);
  };

  const listSelectedDates = (dates: string[]) => {
    setSelectedDates(dates);
  };

  const setCalendarView = (view: boolean) => {
    setShowCalendar(view);
  };

  const setDates = (startDate: string, endDate: string) => {
    setStartDate(startDate);
    setEndtDate(endDate);
  };

  const getFirstFrameDate = (dateFrame: DataFrameDateProps) => {
    setFirstFrameDate(dateFrame);
  };
  const getLastFrameDate = (dateFrame: DataFrameDateProps) => {
    setLastFrameDate(dateFrame);
  };
  const getCurrentFrameDate = (dateFrame: DataFrameDateProps) => {
    setCurrentFrameDate(dateFrame);
  };

  const setDateFrameList = (dataFrameList: DataFrameDateProps[]) => {
    setDateList(dataFrameList);
  };

  const setHolidays = (holidays: HolidayProps[]) => {
    setHolidaysList(holidays);
  };

  const setMonthTotalHours = (hours: number) => {
    setTotalHours(hours);
  };

  const setAppWebViewState = (state: string) => {
    setAppState(state);
  };

  return (
    <TimeRegistrationContext.Provider
      value={{
        startDate,
        endDate,
        urlParams,
        selectedDates,
        token,
        timeRegistrations,
        timeSheetCodes,
        showCalendarView,
        firstFrameDate,
        currentFrameDate,
        lastFrameDate,
        dataFrameList,
        holidaysList,
        totalHours,
        appState,
        filteredData,
        isLoading,
        events,
        setMonthEvents,
        setIsLoadingData,
        setFilteredData,
        setAppWebViewState,
        setMonthTotalHours,
        setHolidays,
        setDateFrameList,
        getFirstFrameDate,
        getLastFrameDate,
        getCurrentFrameDate,
        setCalendarView,
        setDates,
        listSelectedDates,
        listTimeRegistration,
        editUserTimeRegistratrion,
      }}
    >
      {children}
    </TimeRegistrationContext.Provider>
  );
}
