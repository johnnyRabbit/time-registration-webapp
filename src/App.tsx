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
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      window["ReactNativeWebView"] &&
        window["ReactNativeWebView"].postMessage(
          JSON.stringify({ key: "value" })
        );

      if (event.data === "callFunction") {
        // Call the function in WebView
        alert("Function called within WebView"); // Replace 'yourFunctionName' with the actual function name
        // Send a message back to React Native confirming the function invocation
        window.ReactNativeWebView.postMessage("functionCalled");
      }
    };

    window.addEventListener("message", handleMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <TimeRegistrationProvider>
      <div className="h-screen w-full bg-[#F6F6F6]">
        <TimeRegistraionPage />
      </div>
    </TimeRegistrationProvider>
  );
}

export default App;
