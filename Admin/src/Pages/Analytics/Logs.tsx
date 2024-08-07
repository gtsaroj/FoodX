import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import { useEffect, useState } from "react";
import { LogCardProps } from "../../models/logModel";
import { LogCard } from "../../Components/Common/Cards/LogCard";
import { getLogs } from "../../Services";

const Logs = () => {
  const [items, setItems] = useState<LogCardProps[]>([]);

  const handleCollapseFn = (logId: string) => {
    const logItems = items?.map((item) => {
      if (item.id === logId) {
        return { ...item, open: !item.open };
      }

      return { ...item, open: false };
    });
    console.log(logItems);
  };
  const getAllRoleLogs = async () => {
    try {
      const adminLogs = (await getLogs({
        path: "adminLogs",
        filter: "name",
        sort: "asc",
        pageSize: 5,
        direction: "next",
      })) as {
        currentFirstDoc: string;
        currentLastDoc: string;
        logs: LogCardProps[];
      };
      setItems(adminLogs.logs);

      const chefLogs = await getLogs({
        path: "chefLogs",
        filter: "name",
        sort: "asc",
        pageSize: 5,
      });
      const customerLogs = await getLogs({
        path: "customerLogs",
        filter: "name",
        pageSize: 5,
        sort: "asc",
      });
    } catch (error) {
      throw new Error("Unable to get role logs" + error);
    }
  };
  const handleSelect = async (
    value: "Admin logs" | "Customer Logs" | "Chef Logs"
  ) => {
    if (value === "Admin logs") {
      const adminLogs = (await getLogs({
        path: "adminLogs",
        filter: "name",
        sort: "asc",
        pageSize: 5,
        direction: "next",
      })) as {
        currentFirstDoc: string;
        currentLastDoc: string;
        logs: LogCardProps[];
      };
      setItems(adminLogs.logs);
    }
    if (value === "Chef Logs") {
      const chefLogs = await getLogs({
        path: "chefLogs",
        filter: "name",
        sort: "asc",
        pageSize: 5,
      });
      setItems(chefLogs.logs);
    }
    if (value === "Customer Logs") {
      const customerLogs = await getLogs({
        path: "chefLogs",
        filter: "name",
        sort: "asc",
        pageSize: 5,
      });
      setItems(customerLogs.logs);
    }
  };

  useEffect(() => {
    getAllRoleLogs();
  }, []);

  return (
    <div className="items-start justify-start w-full h-full p-2">
      <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-2 md:max-w-[800px]">
        <div className="flex items-center justify-between w-full gap-5 px-3 pb-5 ">
          <p className="text-lg font-semibold tracking-wide text-nowrap">
            Audit Logs
          </p>
          <div>
            <FilterButton
              onSelect={(value) => handleSelect(value)}
              sortOrder=""
              sortingOptions={["Admin logs", "Customer Logs", "Chef Logs"]}
            />
          </div>
        </div>

        <div className="flex items-start justify-start flex-grow w-full">
          <div className="flex flex-col justify-start w-full gap-3 md:max-w-[800px]">
            {items ? (
              items.map((item) => (
                <LogCard
                  open
                  key={item.id}
                  {...item}
                  handleClick={() => handleCollapseFn(item.id as string)}
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
