// api.js
import { AxiosResponse } from "axios";
import { DateLov, MonthData } from "../views/TimeRegistrationPage";
import api from "./api";
import {
  TimeFramCalendar,
  TimeRegistration,
  TimeSheetCodeProps,
} from "../context/TimeRegistrationContext";

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
      path: "/account/set-password",
      port: 443,
      protocol: "https",
      requestHost:
        "time-registration-webapp-git-master-smartableways.vercel.app",
      userId: 0,
      userName: email,
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const userResetPassword = async (
  password: string,
  confirmPassword: string,
  userName: string,
  code: string
) => {
  try {
    const response = await api.post("/api/Account/ResetPassword", {
      password,
      confirmPassword,
      userName,
      code,
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const getLovsDropdown = async (
  organizationId: number,
  typeName: string,
  onlyParents: boolean,
  onlyActives: boolean,
  token: string
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
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const getTimeFrameCalendars = async (
  organizationId: number,
  timeFrameId: number,
  token: string
) => {
  try {
    const response: AxiosResponse = await api.get(
      "api/Calendars/GetTimeFrameCalendars",
      {
        params: {
          timeFrameId,
          organizationId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
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
  organizationId: number,
  type: string,
  startDate: string,
  endDate: string,
  token: string
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
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const getUserTimeCodes = async (
  organizationId: number,
  userId: number,
  token: string
) => {
  try {
    const response: AxiosResponse = await api.get(
      "api/TimeCodes/GetTimeCodesDropdown",
      {
        params: {
          userId,
          organizationId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const getTimeSheetRegistration = async (
  organizationId: number,
  userId: number,
  timeFrameId: number,
  token: string
) => {
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
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data || {};
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const addUserTimeSheetCode = async (
  data: TimeSheetCodeProps,
  token: string
) => {
  try {
    const response = await api.post("/api/TimeSheetCodes", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const pinnedUserTimeSheetCode = async (
  data: TimeSheetCodeProps,
  token: string
) => {
  try {
    const response = await api.put("/api/TimeSheetCodes", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const addUserTimeRegistration = async (data: any, token: string) => {
  try {
    const response = await api.post("/api/Times/AddMultipleTimes", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const editUserTimes = async (data: any, token: string) => {
  try {
    const response = await api.put("/api/Times", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const removeUserTimes = async (id: number, token: string) => {
  try {
    const response = await api.delete(`/api/Times/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const removeUserTimeSheetCodes = async (
  id: number,
  times: boolean,
  token: string
) => {
  try {
    const response = await api.delete(`/api/TimeSheetCodes/${id}/${times}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const fowardUserPins = async (data: any, token: string) => {
  try {
    const response = await api.post(
      "/api/TimeSheetCodes/CopyTimeSheetCodes",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const completeTimeSheets = async (data: any, token: string) => {
  try {
    const response = await api.put("/api/TimeSheets", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export const addTimeSheets = async (data: any, token: string) => {
  try {
    const response = await api.post("/api/TimeSheets", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
};

export default api;
