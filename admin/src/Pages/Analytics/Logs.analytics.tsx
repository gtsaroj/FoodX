import InfiniteScroll from "react-infinite-scroll-component";
import React, { useEffect, useState } from "react";
import {
  GetLogProp,
  LogActionModal,
  LogCardProps,
} from "../../models/log.model";
import { LogCard } from "../../Components/Common/Cards/LogCard";
import { getLogs } from "../../Services/log.services";
import { Button } from "../../Components/Common/Button/Button";
import { Filter, X } from "lucide-react";
import { RotatingLines } from "react-loader-spinner";

const Logs = () => {
  const [items, setItems] = useState<LogCardProps[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(0);
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirst: string;
    currentLastDoc: string;
  }>();
  const [loading, setLoading] = useState<boolean>(false);

  const [filter, setFilter] = useState<{
    typeFilter?: {
      type?: "adminLogs" | "chefLogs" | "customerLogs" | string;
      id?: string;
    };
    sortFilter?: { sort?: string; id?: string };
    actionFilter?: { id?: string; action?: keyof LogActionModal | string };
  }>();
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  const handleCollapseFn = (logId: string) => {
    const logItems = items.map((item) =>
      item.id === logId
        ? { ...item, open: !item.open }
        : { ...item, open: false }
    );
    setItems(logItems);
  };

  const getAllRoleLogs = React.useCallback(
    async ({
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
          path,
          filter,
          sort,
          pageSize,
          direction,
          currentFirstDoc: currentFirstDoc || null,
          currentLastDoc: currentLastDoc || null,
          action: action || undefined,
        })) as {
          currentFirstDoc: string;
          currentLastDoc: string;
          logs: LogCardProps[];
          length: number;
        };

        setTotalData((prevTotal) => prevTotal + adminLogs.logs.length);

        if (adminLogs.logs.length < pageSize) {
          setHasMore(false); // If fewer logs are returned than requested, stop infinite scrolling.
        }

        setItems((prev) => {
          return [
            ...prev,
            ...adminLogs.logs.filter(
              (log) => !prev.some((data) => data.id === log.id)
            ),
          ];
        });
        setCurrentDoc({
          currentFirst: adminLogs.currentFirstDoc,
          currentLastDoc: adminLogs.currentLastDoc,
        });
      } catch (error) {
        console.error("Unable to get role logs:", error);
      }
    },
    [
      filter?.typeFilter?.type,
      filter?.actionFilter?.action,
      filter?.sortFilter?.sort,
      sort,
    ]
  );

  useEffect(() => {
    // Reset data when filters are changed
    setItems([]);
    setTotalData(0);
    setCurrentDoc(undefined);
    setHasMore(true);

    // Fetch logs with the new filters applied
    setLoading(true);
    getAllRoleLogs({
      path:
        (filter?.typeFilter?.type as
          | "customerLogs"
          | "adminLogs"
          | "chefLogs") || "adminLogs",
      filter: (filter?.sortFilter?.sort as keyof LogCardProps) || "name",
      pageSize: 10,
      sort,
      currentFirstDoc: null,
      currentLastDoc: null,
      direction: "next",
      action: filter?.actionFilter?.action as LogActionModal["action"],
    });
    setLoading(false);
  }, [
    filter?.typeFilter?.type,
    filter?.actionFilter?.action,
    filter?.sortFilter?.sort,
    sort,
  ]);

  return (
    <div className="items-start justify-start w-full h-full p-2">
      <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-2 md:max-w-[800px]">
        <div className="flex items-center justify-between w-full gap-5 px-3 pb-5 ">
          <div className="flex items-center justify-start gap-2">
            <p className="text-lg text-[var(--dark-text)] font-semibold tracking-wide text-nowrap">
              Audit Logs
            </p>
            <div className="flex items-center justify-start gap-2">
              {filter?.sortFilter?.sort && (
                <div className="flex px-2 py-0.5  gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
                  <div className="flex gap-1 items-center justify-center">
                    <span className="  text-[15px] text-[var(--dark-secondary-text)] ">
                      {filter.sortFilter?.sort?.charAt(0).toUpperCase() +
                        filter?.sortFilter?.sort?.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        sortFilter: { id: "", sort: "" },
                      }))
                    }
                  >
                    <X className="text-[var(--danger-text)] " size={20} />
                  </button>
                </div>
              )}
              {filter?.typeFilter?.type && (
                <div className="flex px-2 py-0.5 w-full gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
                  <div className="flex gap-1 items-center justify-center">
                    <span className="  text-[15px] text-[var(--dark-secondary-text)] ">
                      {filter.typeFilter.type.charAt(0).toUpperCase() +
                        filter?.typeFilter?.type?.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        typeFilter: { id: "", type: "" },
                      }))
                    }
                  >
                    <X className="text-[var(--danger-text)] " size={20} />
                  </button>
                </div>
              )}
              {filter?.actionFilter?.action && (
                <div className="flex px-2 py-0.5 w-full gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
                  <div className="flex gap-1 items-center justify-center">
                    <span className="  text-[15px] text-[var(--dark-secondary-text)] ">
                      {filter.actionFilter.action?.charAt(0).toUpperCase() +
                        filter?.actionFilter?.action?.slice(1).toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        actionFilter: { action: "", id: "" },
                      }))
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
              selectedAction={[filter?.actionFilter?.id as string]}
              selectedCheck={[filter?.sortFilter?.id as string]}
              selectedTypes={[filter?.typeFilter?.id as string]}
              bodyStyle={{
                width: "400px",
                top: "3rem",
                left: "-18rem",
              }}
              parent={
                <div className="flex border-[1px] border-[var(--dark-border)] px-4 py-2 rounded items-center justify-start gap-3">
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
                  label: "Login",
                  value: "login",
                  id: "fkdjs;jfdskewoij930ikds",
                },
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
                checkTypeFn: (isChecked, type, id) => {
                  if (!isChecked) {
                    setFilter((prev) => ({
                      ...prev,
                      typeFilter: { id: "", type: "" },
                    }));
                  }
                  if (isChecked) {
                    setFilter((prev) => ({
                      ...prev,
                      typeFilter: { id: id, type: type },
                    }));
                  }
                },
                checkSortFn: (isChecked, value, id) => {
                  if (!isChecked) {
                    setFilter((prev) => ({
                      ...prev,
                      sortFilter: { id: "", sort: "" },
                    }));
                  }
                  if (isChecked) {
                    setFilter((prev) => ({
                      ...prev,
                      sortFilter: { sort: value, id: id },
                    }));
                  }
                },
                checkActionFn: (isChecked, action, id) => {
                  if (!isChecked) {
                    return setFilter((prev) => ({
                      ...prev,
                      actionFilter: { action: "", id: "" },
                    }));
                  }
                  if (isChecked) {
                    setFilter((prev) => ({
                      ...prev,
                      actionFilter: { action: action, id: id },
                    }));
                  }
                },
              }}
            />
          </div>
        </div>

        <div
          id="scrollableDiv"
          className="flex items-start  p-1   scroll-smooth  scrollbar-custom px-2 overflow-y-auto  w-full"
        >
          <div className="flex h-[400px] min-w-[400px]  p-2 flex-col justify-start w-full gap-3 md:max-w-[800px]">
            <InfiniteScroll
              scrollableTarget={"scrollableDiv"}
              dataLength={totalData ? totalData : 0}
              hasMore={hasMore}
              next={() =>
                getAllRoleLogs({
                  path:
                    (filter?.typeFilter?.type as
                      | "customerLogs"
                      | "adminLogs"
                      | "chefLogs") || "adminLogs",
                  filter:
                    (filter?.sortFilter?.sort as keyof LogCardProps) || "name",
                  pageSize: 10,
                  sort,
                  currentFirstDoc: currentDoc?.currentFirst || null,
                  currentLastDoc: currentDoc?.currentLastDoc || null,
                  direction: "next",
                  action: filter?.actionFilter as keyof LogCardProps["action"],
                })
              }
              loader={
                <div className="w-full flex flex-col items-center pt-3 justify-center ">
                  {/* <Skeleton height={70} count={5} /> */}
                  <div className="flex items-center justify-center gap-3">
                    <RotatingLines strokeColor="var(--dark-text)" width="27" />
                    <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
                      {" "}
                      loading...
                    </span>
                  </div>
                </div>
              }
            >
              {loading ? (
                <div className="w-full flex flex-col items-center pt-3 justify-center ">
                  {/* <Skeleton height={70} count={5} /> */}
                  <div className="flex items-center justify-center gap-3">
                    <RotatingLines strokeColor="var(--dark-text)" width="27" />
                    <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
                      {" "}
                      loading...
                    </span>
                  </div>
                </div>
              ) : items.length > 0 ? (
                <div className="flex flex-col justify-center gap-5 w-full">
                  {items.map((item) => (
                    <LogCard
                      open
                      key={item.id}
                      {...item}
                      handleClick={() => handleCollapseFn(item.id as string)}
                    />
                  ))}
                </div>
              ) : (
              ""
              )}
            </InfiniteScroll>
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
