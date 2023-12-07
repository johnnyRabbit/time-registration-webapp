import { useEffect } from "react";
import "./App.css";
import { TimeRegistrationProvider } from "./context/TimeRegistrationContext";
import TimeRegistraionPage from "./views/TimeRegistrationPage";

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
      // Add other properties or methods if needed
    };
  }
}
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
