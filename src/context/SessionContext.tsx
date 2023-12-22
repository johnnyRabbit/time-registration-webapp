import React, { createContext, useState } from "react";

interface SessionContextProps {
  isLoggedIn: boolean;
  userId: number | null;
  orgId: number | null;
  token: string | null;
  login: (userId: number, orgId: number, token: string) => void;
  logout: () => void;
}

export const SessionContext = createContext<SessionContextProps>({
  isLoggedIn: false,
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => !!sessionStorage.getItem("isLoggedIn")
  );
  const [userId, setUserId] = useState<number | null>(() =>
    Number(sessionStorage.getItem("userId"))
  );
  const [orgId, setOrgId] = useState<number | null>(() =>
    Number(sessionStorage.getItem("orgId"))
  );

  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem("token")
  );

  const login = (userId: number, orgId: number, token: string) => {
    setIsLoggedIn(true);
    setUserId(userId);
    setOrgId(orgId);
    setToken(token);
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userId", userId.toString());
    sessionStorage.setItem("orgId", orgId.toString());
    sessionStorage.setItem("token", token);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setOrgId(null);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("orgId");
    sessionStorage.removeItem("token");
  };

  const sessionData: SessionContextProps = {
    isLoggedIn,
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
