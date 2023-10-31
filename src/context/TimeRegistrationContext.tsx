// TimeRegistrationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type TimeRegistration = {
  id?: string;
  date: string;
  description: string;
  timeCode: string;
  time: number;
};

type TimeRegistrationContextType = {
  timeRegistrations: TimeRegistration[];
  addTimeRegistration: (registration: TimeRegistration) => void;
  removeTimRegistration: (registration: TimeRegistration) => void;
  editTimeRegistratrion: (registration: TimeRegistration) => void;
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
  const [timeRegistrations, setTimeRegistrations] = useState<
    TimeRegistration[]
  >([]);

  const addTimeRegistration = (registration: TimeRegistration) => {
    setTimeRegistrations((prev) => [...prev, registration]);
  };

  const editTimeRegistratrion = (registration: TimeRegistration) => {
    setTimeRegistrations((prev) => [...prev, registration]);
  };

  const removeTimRegistration = (registration: TimeRegistration) => {
    setTimeRegistrations((prev) => [...prev, registration]);
  };

  return (
    <TimeRegistrationContext.Provider
      value={{
        timeRegistrations,
        addTimeRegistration,
        removeTimRegistration,
        editTimeRegistratrion,
      }}
    >
      {children}
    </TimeRegistrationContext.Provider>
  );
}
