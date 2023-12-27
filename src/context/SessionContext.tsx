import React, { createContext, useState } from "react";

interface SessionContextProps {
  isLoggedIn: boolean;
  isFromMobile: boolean;
  userId: number | null;
  orgId: number | null;
  token: string | null;
  login: (userId: number, orgId: number, token: string) => void;
  logout: () => void;
}

export const SessionContext = createContext<SessionContextProps>({
  isLoggedIn: false,
  isFromMobile: false,
  userId: null,
  orgId: null,
  token: null,
  login: () => {},
  logout: () => {},
});

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    sessionStorage.length > 0
      ? !!sessionStorage.getItem("isLoggedIn")
      : !!sessionStorage.getItem("isLoggedIn")
  );
  const [userId, setUserId] = useState<number | null>(() =>
    sessionStorage.length > 0
      ? Number(sessionStorage.getItem("userId"))
      : Number(localStorage.getItem("userId"))
  );
  const [orgId, setOrgId] = useState<number | null>(() =>
    sessionStorage.length > 0
      ? Number(sessionStorage.getItem("orgId"))
      : Number(localStorage.getItem("orgId"))
  );

  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.length > 0
      ? sessionStorage.getItem("token")
      : localStorage.getItem("token")
  );

  const [isFromMobile, setIsFromMobile] = useState<boolean>(() =>
    sessionStorage.length > 0
      ? !!sessionStorage.getItem("isFromMobile")
      : !!localStorage.getItem("isFromMobile")
  );

  const login = (userId: number, orgId: number, token: string) => {
    setIsLoggedIn(true);
    setUserId(userId);
    setOrgId(orgId);
    setToken(token);
    localStorage.length === 0
      ? sessionStorage.setItem("isLoggedIn", "true")
      : localStorage.setItem("isLoggedIn", "true");
    localStorage.length === 0
      ? sessionStorage.setItem("userId", userId.toString())
      : localStorage.setItem("userId", userId.toString());
    localStorage.length === 0
      ? sessionStorage.setItem("orgId", orgId.toString())
      : localStorage.setItem("orgId", orgId.toString());
    localStorage.length === 0
      ? sessionStorage.setItem("token", token)
      : localStorage.setItem("token", token);
    localStorage.length === 0
      ? sessionStorage.setItem("isFromMobile", "false")
      : localStorage.setItem("isFromMobile", "false");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setOrgId(null);
    localStorage.length === 0
      ? sessionStorage.removeItem("isLoggedIn")
      : localStorage.removeItem("isLoggedIn");
    localStorage.length === 0
      ? sessionStorage.removeItem("userId")
      : localStorage.removeItem("userId");
    localStorage.length === 0
      ? sessionStorage.removeItem("orgId")
      : localStorage.removeItem("orgId");
    localStorage.length === 0
      ? sessionStorage.removeItem("token")
      : localStorage.removeItem("token");
    localStorage.length === 0
      ? sessionStorage.removeItem("isFromMobile")
      : localStorage.removeItem("isFromMobile");
  };

  const sessionData: SessionContextProps = {
    isLoggedIn,
    isFromMobile,
    userId,
    orgId,
    token,
    login,
    logout,
  };

  return (
    <SessionContext.Provider value={sessionData}>
      {children}
    </SessionContext.Provider>
  );
};
