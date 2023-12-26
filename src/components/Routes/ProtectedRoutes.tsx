// Suppose this is your protected route component where login is required
import React, { ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../../context/SessionContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, userId, orgId, token, login, logout } =
    useContext(SessionContext);

  const navigate = useNavigate();
  console.log("isLogged", isLoggedIn);
  // If not logged in, redirect to the login page
  if (!isLoggedIn) {
    navigate("/account/login");
  }

  // If logged in, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
