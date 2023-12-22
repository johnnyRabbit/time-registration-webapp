import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { TimeRegistrationProvider } from "./context/TimeRegistrationContext";
import TimeRegistraionPage from "./views/TimeRegistrationPage";
import Login from "./components/Login/Login";
import NotFound from "./views/NotFound/NotFound";
import ForgotPassword from "./views/ForgotPassword/ForgotPassword";
import SetPassword from "./views/SetPassword/SetPassword";
import { SessionProvider } from "./context/SessionContext";

function App() {
  return (
    <SessionProvider>
      <TimeRegistrationProvider>
        <div className="h-screen w-full bg-[#F6F6F6]">
          <BrowserRouter>
            <Routes>
              <Route index path="/account/login" element={<Login />} />
              <Route
                path="/user/time-registration"
                element={<TimeRegistraionPage />}
              />
              <Route
                path="/account/forgot-password"
                element={<ForgotPassword />}
              />
              <Route path="/account/set-password" element={<SetPassword />} />
              <Route path="/not-found" element={<NotFound />} />
              <Route
                path="*"
                element={<Navigate to="/account/login" replace />}
              />
            </Routes>
          </BrowserRouter>
        </div>
      </TimeRegistrationProvider>
    </SessionProvider>
  );
}

export default App;
