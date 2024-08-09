import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import { useEffect, useState } from "react";
import { GetLogProp, LogCardProps } from "../../models/logModel";
import { LogCard } from "../../Components/Common/Cards/LogCard";
import { getLogs } from "../../Services";
import { Button } from "../../Components/Common/Button/Button";
import { Filter } from "lucide-react";

const Logs = () => {
  const [items, setItems] = useState<LogCardProps[]>([]);
  const [pagination, setPagination] = useState<{
    perPage: number;
    currentPage: number;
  }>({ perPage: 5, currentPage: 1 });
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirst: string;
    currentLastDoc: string;
  }>();

  const handleCollapseFn = (logId: string) => {
    const logItems = items?.map((item) => {
      if (item.id === logId) {
        return { ...item, open: !item.open };
      }

      return { ...item, open: false };
    });
    console.log(logItems);
  };
  const getAllRoleLogs = async ({
    path,
    pageSize,
    filter,
    sort,
    action,
    currentFirstDoc,
    currentLastDoc,
    direction,
  }: GetLogProp) => {
    try {
      const adminLogs = (await getLogs({
        path: path,
        filter: filter,
        sort: sort,
        pageSize: pageSize,
        direction: direction,
        currentFirstDoc: currentFirstDoc || null,
        currentLastDoc: currentLastDoc || null,
        action: action,
      })) as {
        currentFirstDoc: string;
        currentLastDoc: string;
        logs: LogCardProps[];
      };
      setItems(adminLogs.logs);
    } catch (error) {
      throw new Error("Unable to get role logs" + error);
    }
  };
  const handleSelect = async (
    isChecked: boolean,
    value: "adminlogs" | "customerlogs" | "cheflogs"
  ) => {
    if (value === "adminlogs" && isChecked) {
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
    if (value === "cheflogs" && isChecked) {
      const chefLogs = await getLogs({
        path: "chefLogs",
        filter: "name",
        sort: "asc",
        pageSize: 5,
      });
      setItems(chefLogs.logs);
    }
    if (value === "customerlogs" && isChecked) {
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
    getAllRoleLogs({
      path: "adminLogs",
      filter: "id",
      pageSize: pagination.perPage,
      sort: "asc",
      currentFirstDoc: currentDoc?.currentFirst,
      currentLastDoc: currentDoc?.currentLastDoc,
    });
  }, [
    currentDoc?.currentFirst,
    currentDoc?.currentLastDoc,
    pagination.perPage,
  ]);

  return (
    <div className="items-start justify-start w-full h-full p-2">
      <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-2 md:max-w-[800px]">
        <div className="flex items-center justify-between w-full gap-5 px-3 pb-5 ">
          <p className="text-lg font-semibold tracking-wide text-nowrap">
            Audit Logs
          </p>
          <div>
            <Button
              bodyStyle={{
                width: "400px",
                top: "3rem",
                left: "-18rem",
              }}
              parent={
                <div className="flex border px-4 py-2 rounded items-center justify-start gap-3">
                  <Filter className="size-5 text-[var(--dark-secondary-text)]" />
                  <span className=" text-[17px] tracking-wide text-[var(--dark-secondary-text)]">
                    Filter
                  </span>
                </div>
              }
              types={[
                { label: "Admin Logs", value: "adminlogs", id: "fskfjs" },
                {
                  label: "Chef Logs",
                  value: "cheflogs",
                  id: "fkldsj",
                },
                { label: "Customer Logs", id: "fls", value: "customerlogs" },
              ]}
              sortFn={(isChecked: boolean, value: string) =>
                handleSelect(isChecked, value)
              }
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
