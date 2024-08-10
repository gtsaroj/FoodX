import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import { useEffect, useState } from "react";
import {
  GetLogProp,
  LogActionModal,
  LogCardProps,
} from "../../models/logModel";
import { LogCard } from "../../Components/Common/Cards/LogCard";
import { getLogs } from "../../Services";
import { Button } from "../../Components/Common/Button/Button";
import { Filter, X } from "lucide-react";
import Skeleton from "react-loading-skeleton";

const Logs = () => {
  const [items, setItems] = useState<LogCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<{
    perPage: number;
    currentPage: number;
  }>({ perPage: 5, currentPage: 1 });
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirst: string;
    currentLastDoc: string;
  }>();
  const [isFilter, setIsFilter] = useState<{
    typeFilter?: "adminLogs" | "chefLogs" | "customerLogs" | string;
    sortFilter?: string;
    actionFilter?: keyof LogActionModal | string;
  }>();
  const [sort, setSort] = useState<"asc" | "desc">("asc");

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
    setLoading(true);
    try {
      const adminLogs = (await getLogs({
        path: path,
        filter: filter,
        sort: sort,
        pageSize: pageSize,
        direction: direction,
        currentFirstDoc: currentFirstDoc || null,
        currentLastDoc: currentLastDoc || null,
        action: action || undefined,
      })) as {
        currentFirstDoc: string;
        currentLastDoc: string;
        logs: LogCardProps[];
      };
      setItems(adminLogs.logs);
      setCurrentDoc({
        currentFirst: adminLogs.currentFirstDoc,
        currentLastDoc: adminLogs.currentLastDoc,
      });
    } catch (error) {
      throw new Error("Unable to get role logs" + error);
    }
    setLoading(false);
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
      path:
        (isFilter?.typeFilter as "adminLogs" | "chefLogs" | "customerLogs") ||
        "adminLogs",
      filter: (isFilter?.sortFilter as keyof LogCardProps) || "id",
      pageSize: pagination.perPage,
      sort: (sort as "asc" | "desc") || "asc",
      currentFirstDoc: null,
      currentLastDoc: null,
      action:
        (isFilter?.actionFilter as
          | "login"
          | "update"
          | "delete"
          | "register"
          | "logout") || undefined,
    });
  }, [
    isFilter?.sortFilter,
    isFilter?.typeFilter,
    pagination.perPage,
    sort,
    isFilter,
  ]);

  return (
    <div className="items-start justify-start w-full h-full p-2">
      <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-2 md:max-w-[800px]">
        <div className="flex items-center justify-between w-full gap-5 px-3 pb-5 ">
          <div className="flex items-center justify-start gap-2">
            <p className="text-lg font-semibold tracking-wide text-nowrap">
              Audit Logs
            </p>
            <div className="flex items-center justify-start gap-2">
              {isFilter?.sortFilter && (
                <div className="flex px-2 py-0.5  gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
                  <div className="flex gap-1 items-center justify-center">
                    <span className="  text-[15px] text-[var(--dark-secondary-text)] ">
                      {isFilter.sortFilter.toLowerCase()}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setIsFilter((prev) => ({ ...prev, sortFilter: "" }))
                    }
                  >
                    <X className="text-[var(--danger-text)] " size={20} />
                  </button>
                </div>
              )}
              {isFilter?.typeFilter && (
                <div className="flex px-2 py-0.5 w-full gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
                  <div className="flex gap-1 items-center justify-center">
                    <span className="  text-[15px] text-[var(--dark-secondary-text)] ">
                      {isFilter.typeFilter.toLowerCase()}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setIsFilter((prev) => ({ ...prev, typeFilter: "" }))
                    }
                  >
                    <X className="text-[var(--danger-text)] " size={20} />
                  </button>
                </div>
              )}
              {isFilter?.actionFilter && (
                <div className="flex px-2 py-0.5 w-full gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
                  <div className="flex gap-1 items-center justify-center">
                    <span className="  text-[15px] text-[var(--dark-secondary-text)] ">
                      {isFilter.actionFilter.toLowerCase()}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setIsFilter((prev) => ({ ...prev, actionFilter: "" }))
                    }
                  >
                    <X className="text-[var(--danger-text)] " size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
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
                { label: "Admin ", value: "adminLogs", id: "fskfjs" },
                {
                  label: "Chef ",
                  value: "chefLogs",
                  id: "fkldsj",
                },
                { label: "Customer ", id: "fls", value: "customerLogs" },
              ]}
              sort={[{ label: "Date", value: "date", id: "aforapple" }]}
              action={[
                { label: "Create", value: "create", id: "dflkjsklkfkls" },
                { label: "Register", value: "register", id: "dlalksslk" },
                {
                  label: "Delete",
                  value: "delete",
                  id: "dflkfseweejsklk",
                },
                {
                  label: "Update",
                  value: "update",
                  id: "dflkjskfdsflk",
                },
                {
                  label: "Logout",
                  value: "logout",
                  id: "flkjdsljfoie",
                },
              ]}
              sortFn={(value) => setSort(value)}
              checkFn={{
                checkTypeFn: (isChecked, type) => {
                  if (!isChecked) {
                    setIsFilter((prev) => ({ ...prev, typeFilter: "" }));
                  }
                  if (isChecked) {
                    setIsFilter((prev) => ({ ...prev, typeFilter: type }));
                  }
                },
                checkSortFn: (isChecked, value) => {
                  if (!isChecked) {
                    setIsFilter((prev) => ({ ...prev, sortFilter: "" }));
                  }
                  if (isChecked) {
                    setIsFilter((prev) => ({ ...prev, sortFilter: value }));
                  }
                },
                checkActionFn: (isChecked, action) => {
                  if (!isChecked) {
                    return setIsFilter((prev) => ({
                      ...prev,
                      actionFilter: "",
                    }));
                  }
                  if (isChecked) {
                    setIsFilter((prev) => ({ ...prev, actionFilter: action }));
                  }
                },
              }}
            />
          </div>
        </div>

        <div className="flex items-start justify-start flex-grow w-full">
          <div className="flex flex-col justify-start w-full gap-3 md:max-w-[800px]">
            {!loading ? (
              items ? (
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
              )
            ) : (
              <div className="w-full ">
                <Skeleton height={70} count={5} />
              </div>
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
