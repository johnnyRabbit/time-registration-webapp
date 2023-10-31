import { useEffect, useState } from "react";
import { MonthYear } from "../components/MonthYear/MonthYear";
import CustomButton from "../components/CustomButton/CustomButton";
import { FaMapPin, FaPlus } from "react-icons/fa";
import { TimeCodeItem } from "../components/ListProjects/ListOfProjects";
import EventCalendar from "../components/EventCalendar/EventCalendar";
import { TimeRegistrationProps } from "../components/AddTimeRegistration/AddTimeRegistration";

const TimeRegistraionPage: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showFormBox, setshowFormBox] = useState<boolean>(false);
  const [pathfrom, setPathFrom] = useState<string>();
  const [hasRecords, setHasRecords] = useState<boolean>();
  const [timeRegistrationList, setTimeRegistrationList] = useState<
    TimeRegistrationProps[]
  >([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    console.log("token", token);
  }, []);

  useEffect(() => {
    console.log("load time registration");
    setHasRecords(false);
  }, []);

  const onShowCalendar = () => {
    setShowCalendar(true);
    setPathFrom("calendarScreen");
  };

  const onShowFormBox = () => {
    setshowFormBox(true);
    setShowCalendar(true);
    setPathFrom("mainScreen");
  };

  const onShowPinned = () => {
    setHasRecords(true);
  };

  const onCancel = () => {
    setShowCalendar(false);
    setshowFormBox(false);
  };

  return (
    <div>
      {!showCalendar ? <MonthYear /> : <></>}
      <div className="w-full min-h-max flex flex-row just">
        <div className="calendar-container w-full flex flex-col items-center">
          <div className="calendar-view w-full flex flex-col ">
            {!showCalendar ? (
              <>
                <div className="w-full flex flex-col mt-4  mb-2 pr-4 pl-4">
                  <CustomButton
                    color="green"
                    text={"Overview Calendar >"}
                    style={styles.overViewBtn}
                    onClick={() => onShowCalendar()}
                  />
                </div>
                {hasRecords ? (
                  <div className="pr-4 pl-4">
                    {timeRegistrationList.map((item, index) => {
                      return (
                        <TimeCodeItem
                          data={item}
                          key={index}
                          screen="mainScreen"
                          edit={() => console.log("edit from main page")}
                          remove={() => console.log("remove from main page")}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}

                <div className="total-container pr-4 pl-4 mb-8 mt-2 w-full justify-between">
                  <div className="w-full flex flex-row justify-between font-semibold p-2 pr-4 pl-4 bg-white mb-2 rounded-md">
                    <span className=" text-[#0B2E5F]  text-lg ">
                      Total Work Hours:
                    </span>
                    <span className=" text-[#0B2E5F]  text-lg">0</span>
                  </div>
                  <div className="w-full flex flex-row font-semibold justify-between p-2  pr-4 pl-4  bg-white rounded-md">
                    <span className=" text-[#0B2E5F] text-lg">
                      Total Work Days:
                    </span>
                    <span className=" text-[#0B2E5F] text-lg">0</span>
                  </div>
                </div>
                <div className="calendar-btn-container flex flex-col w-full pl-4 pr-4">
                  <div className="flex w-full flex-col mb-3">
                    <CustomButton
                      color="green"
                      text={"NEM TIME REGISTRATION"}
                      icon={<FaPlus />}
                      style={styles.btnNewTR}
                      onClick={() => onShowFormBox()}
                    />
                  </div>
                  <div className="flex w-full flex-col mb-3">
                    <CustomButton
                      text="IMPORT PINS"
                      color="blue"
                      style={styles.btnImportPins}
                      icon={<FaMapPin />}
                      onClick={() => onShowPinned()}
                    />
                  </div>

                  <div className={`flex w-full flex-col mb-3`}>
                    <CustomButton
                      text="COMPLETE TIMESHEET"
                      color="blue"
                      style={styles.btnButtonDisabled}
                      onClick={() => alert("Button Clicked")}
                    />
                  </div>
                </div>
              </>
            ) : (
              <EventCalendar
                showFormBox={showFormBox}
                onCancel={() => onCancel()}
                from={pathfrom}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overViewBtn: {
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    color: "#1C85E8",
    fontWeight: "bold",
  },
  btnButtonDisabled: {
    color: "white",
    background: "#ABABAB 0% 0% no-repeat padding-box",
  },
  btnImportPins: {
    background: "#0B2E5F 0% 0% no-repeat padding-box",
    color: "white",
  },
  btnNewTR: {
    background: "#1C85E8 0% 0% no-repeat padding-box",
    color: "white",
  },
};

export default TimeRegistraionPage;
