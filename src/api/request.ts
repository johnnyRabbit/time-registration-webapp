// api.js
import { AxiosResponse } from "axios";
import { DateLov, MonthData } from "../views/TimeRegistrationPage";
import api from "./api";
import {
  TimeFramCalendar,
  TimeRegistration,
  TimeSheetCodeProps,
} from "../context/TimeRegistrationContext";

const urlParams = new URLSearchParams(window.location.search);

const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJoZWxpby5tYXJ0aW5zQGJsdWVwYW5kYS5wdCIsImp0aSI6IjIzMWFlMmFlLWM0ZWUtNDFkMi1hYjM0LTlkZTBlYjQ2YzA4MSIsImVtYWlsIjoiaGVsaW8ubWFydGluc0BibHVlcGFuZGEucHQiLCJ1aWQiOiIzNSIsImlzd2ViIjoiRmFsc2UiLCJvcmdzIjoiWzIsMywxOSw2LDcwXSIsIm9yZ2lkIjoiMiIsImNoaWxkb3JncyI6IlszLDE5LDQ5LDcwXSIsInVzZXJyb2xlcyI6IltcIkFETUlOXCIsXCJNQU5BR0VSXCIsXCJIUkFETUlOXCIsXCJDT01QQURNSU5cIixcIlRFQU1cIixcIlVTRVJcIl0iLCJyb2xlcyI6WyJBRE1JTiIsIk1BTkFHRVIiLCJIUkFETUlOIiwiQ09NUEFETUlOIiwiVEVBTSIsIlVTRVIiXSwiZXhwIjoxNzAyNTc2MjczLCJpc3MiOiJLYW1lbGVvbklkZW50aXR5IiwiYXVkIjoiS2FtZWxlb25JZGVudGl0eVVzZXIifQ.o2g0iakHAHnJNIWhA28zy1fVy790AqXWfq1lSSmVJos`;
const userId = 35; // urlParams.get("userId");
const organizationId = 2; // urlParams.get("organizationId");

export const userAuthenticate = async (email: string, password: string) => {
  try {
    const response = await api.post("/api/Account/authenticate", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const userForgotPassword = async (email: string) => {
  try {
    const response = await api.post("/api/Account/ForgotPassword", {
      organizationId: 0,
      path: "/account/forgot-password",
      port: 443,
      protocol: "http",
      requestHost:
        "time-registration-webapp-git-master-smartableways.vercel.app",
      userId: 0,
      userName: "joao.coelho@bluepanda.pt",
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const getLovsDropdown = async (
  typeName: string,
  onlyParents: boolean,
  onlyActives: boolean
) => {
  try {
    const response: AxiosResponse<MonthData[]> = await api.get(
      "api/Lovs/GetLovsDropdown",
      {
        params: {
          organizationId,
          typeName,
          onlyParents,
          onlyActives,
        },
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const getTimeFrameCalendars = async (timeFrameId: number) => {
  try {
    const response: AxiosResponse = await api.get(
      "api/Calendars/GetTimeFrameCalendars",
      {
        params: {
          timeFrameId,
          organizationId,
        },
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const getDateLovs = async (
  type: string,
  startDate: string,
  endDate: string
) => {
  try {
    const response: AxiosResponse<DateLov> = await api.get(
      "api/Lovs/GetDateLov",
      {
        params: {
          type,
          startDate,
          endDate,
          organizationId,
        },
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const getUserTimeCodes = async () => {
  try {
    const response: AxiosResponse = await api.get(
      "api/TimeCodes/GetTimeCodesDropdown",
      {
        params: {
          userId,
          organizationId,
        },
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const getTimeSheetRegistration = async (timeFrameId: number) => {
  try {
    const response: AxiosResponse<TimeRegistration> = await api.get(
      "api/TimeSheets/GetTimeSheetRegistration",
      {
        params: {
          userId,
          organizationId,
          timeFrameId,
        },
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data || {};
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const addUserTimeSheetCode = async (data: TimeSheetCodeProps) => {
  try {
    const response = await api.post("/api/TimeSheetCodes", data, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const pinnedUserTimeSheetCode = async (data: TimeSheetCodeProps) => {
  try {
    const response = await api.put("/api/TimeSheetCodes", data, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const addUserTimeRegistration = async (data: any) => {
  try {
    const response = await api.post("/api/Times/AddMultipleTimes", data, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const editUserTimes = async (data: any) => {
  try {
    const response = await api.put("/api/Times", data, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const removeUserTimes = async (id: number) => {
  try {
    const response = await api.delete(`/api/Times/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const removeUserTimeSheetCodes = async (id: number, times: boolean) => {
  try {
    const response = await api.delete(`/api/TimeSheetCodes/${id}/${times}`, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const fowardUserPins = async (data: any) => {
  try {
    const response = await api.post(
      "/api/TimeSheetCodes/CopyTimeSheetCodes",
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const completeTimeSheets = async (data: any) => {
  try {
    const response = await api.put("/api/TimeSheets", data, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const addTimeSheets = async (data: any) => {
  try {
    const response = await api.post("/api/TimeSheets", data, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export default api;
