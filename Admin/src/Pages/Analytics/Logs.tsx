import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import { useEffect, useState } from "react";
import { LogCardProps } from "../../models/logModel";
import { LogCard } from "../../Components/Common/Cards/LogCard";
import { addLogs, getActionLogs, getRoleLogs } from "../../Services";
import { log } from "console";

const LogData = [
  {
    action: "checkout",
    name: "Aayush Lamichhane",
    profile:
      "https://firebasestorage.googleapis.com/v0/b/foodx-nepal.appspot.com/o/users%2F254-2549458_circle-png-download-transparent-revenue-logo-png-download.png?alt=media&token=1d8de06d-5e7e-455c-b300-b3af5c0fad7d",
    date: new Date(),
    detail: "This is detailed log action",
    open: false,
  },
  {
    id: "ssdadad",
    uid: "sadiawnolncls",
    action: "delete",
    name: "Aayush Lamichhane",
    profile:
      "https://firebasestorage.googleapis.com/v0/b/foodx-nepal.appspot.com/o/users%2F254-2549458_circle-png-download-transparent-revenue-logo-png-download.png?alt=media&token=1d8de06d-5e7e-455c-b300-b3af5c0fad7d",
    date: new Date(),
    detail: "This is detailed log action",
    open: false,
  },
  {
    id: "cscsaca",
    uid: "sadiawnolncls",
    action: "login",
    name: "Aayush Lamichhane",
    profile:
      "https://firebasestorage.googleapis.com/v0/b/foodx-nepal.appspot.com/o/users%2F254-2549458_circle-png-download-transparent-revenue-logo-png-download.png?alt=media&token=1d8de06d-5e7e-455c-b300-b3af5c0fad7d",
    date: new Date(),
    detail: "This is detailed log action",
    open: false,
  },
  {
    id: "ewwedasca",
    uid: "sadiawnolncls",
    action: "create",
    name: "Aayush Lamichhane",
    profile:
      "https://firebasestorage.googleapis.com/v0/b/foodx-nepal.appspot.com/o/users%2F254-2549458_circle-png-download-transparent-revenue-logo-png-download.png?alt=media&token=1d8de06d-5e7e-455c-b300-b3af5c0fad7d",
    date: new Date(),
    detail: "This is detailed log action",
    open: false,
  },
];

const Logs = () => {
  const [items, setItems] = useState<LogCardProps[]>([]);
  useEffect(() => {
    setItems(LogData);
  }, []);
  const handleCollapseFn = (logId: string) => {
    const logItems = LogData?.map((item) => {
      if (item.id === logId) {
        console.log(item);

        return { ...item, open: !item.open };
      }
      return { ...item, open: false };
    });
    setItems(logItems);
  };
  const getAllRoleLogs = async () => {
    try {
      const logs = await addLogs(LogData[0]);
      console.log(logs);
    } catch (error) {
      throw new Error("Unable to get role logs" + error);
    }
  };

  useEffect(() => {
    getAllRoleLogs()
  },[])

  return (
    <div className="items-start justify-start w-full h-full p-2">
      <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-2 md:max-w-[800px]">
        <div className="flex items-center justify-between w-full gap-5 px-3 pb-5 ">
          <p className="text-lg font-semibold tracking-wide text-nowrap">
            Audit Logs
          </p>
          <div>
            <FilterButton
              onSelect={() => {}}
              sortOrder=""
              sortingOptions={[""]}
            />
          </div>
        </div>

        <div className="flex items-start justify-start flex-grow w-full">
          <div className="flex flex-col justify-start w-full gap-3 md:max-w-[800px]">
            {items ? (
              items.map((item) => (
                <LogCard
                  key={item.id}
                  {...item}
                  handleClick={() => handleCollapseFn(item.id)}
                />
              ))
            ) : (
              <div>No data to show.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;

/* 
Logic: 
-> 3 type of user: customer, chef, admin
-> login, register, logout, create, update, delete, checkout activities are only logged
-> log data are deleted in 7 days
-> noone can modify log data.
-> this data should be sorted based on timestamp.
-> this data should be filtered based on user type. three docs ["customer", "admin", "chef"] in database collection named "logs"
-> this data should be filtered based on activity type. three docs [login, register, logout, create, update, delete, checkout]


example: 
user_log = [
{}, {}, {}
]

*/
