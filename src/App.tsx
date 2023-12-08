import { useEffect } from "react";
import "./App.css";
import { TimeRegistrationProvider } from "./context/TimeRegistrationContext";
import TimeRegistraionPage from "./views/TimeRegistrationPage";
import TopBar from "./components/TopBar/TopBar";

function App() {
  return (
    <TimeRegistrationProvider>
      <div className="h-screen w-full bg-[#F6F6F6]">
        <TimeRegistraionPage />
      </div>
    </TimeRegistrationProvider>
  );
}

export default App;
