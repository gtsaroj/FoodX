import { PieChart } from "@mui/x-charts";
import { categoryCurrentData, categoryPreviousData } from "../../data.json";
import { useEffect, useState } from "react";
import { Button } from "../Common/Button/Button";
import { Filter, X } from "lucide-react";

export const PieChartAnalytics = () => {
  const [initialData, setInitialData] = useState<any[]>([]);

  const [filter, setIsFilter] = useState<{
    dateFilter?: string;
    normalFilter?: string;
  }>();

  useEffect(() => {
    if (filter?.dateFilter || filter?.normalFilter) {
      setInitialData(categoryPreviousData);
    } else {
      setInitialData(categoryCurrentData);
    }
  }, [filter?.dateFilter, filter?.normalFilter]);

  return (
    <div className="w-full py-1 h-[350px]  gap-3 sm:h-[430px]">
      {" "}
      <div className="flex  h-[20px] my-1 w-full px-2   items-center justify-start gap-2">
        {filter?.dateFilter && (
          <div className="flex px-2 w-[180px]  overflow-hidden py-0.5 gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] text-[var(--dark-secondary-text)]">
                {filter.dateFilter?.toLocaleLowerCase().slice(0, 15)}
              </span>
            </div>
            <button
              onClick={() =>
                setIsFilter((prev) => ({ ...prev, dateFilter: "" }))
              }
              className=" "
            >
              <X className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
        {filter?.normalFilter && (
          <div className="flex px-2 w-[120px]  py-0.5 gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] text-[var(--dark-secondary-text)]">
                {filter.normalFilter?.toLocaleLowerCase().slice(0, 15)}
              </span>
            </div>
            <button
              onClick={() =>
                setIsFilter((prev) => ({ ...prev, normalFilter: "" }))
              }
              className=" "
            >
              <X className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
      </div>
      <div className="w-full px-5 flex items-center justify-between ">
        <h1 className="text-xl tracking-wider  pl-1 ">Top Food Categories</h1>
        <Button
          bodyStyle={{
            width: "400px",
            top: "3rem",
            left: "-18rem",
          }}
          types={[{ label: "Previous", value: "previous", id: "fkldsj;fs" }]}
          parent={
            <div className="flex border px-4 py-2 rounded items-center justify-start gap-2">
              <Filter
                strokeWidth={2.5}
                className="size-5 text-[var(--dark-secondary-text)]"
              />
              <p className="text-[16px] text-[var(--dark-secondary-text)] tracking-widest ">
                Filter
              </p>
            </div>
          }
          checkFn={{
            checkTypeFn: (isChecked: boolean, value: string) => {
              if (!isChecked) {
                setIsFilter((prev) => ({ ...prev, normalFilter: "" }));
              }
              if (isChecked) {
                setIsFilter((prev) => ({ ...prev, normalFilter: value }));
              }
            },
            dateActionFn: (firstDate, secondDate) => {
              if (firstDate && secondDate) {
                setIsFilter((prev) => ({
                  ...prev,
                  dateFilter: `${firstDate} to ${secondDate} `,
                }));
              }
            },
          }}
        />
      </div>
      <div className="w-full h-full ">
        <PieChart
          sx={{ cursor: "pointer" }}
          series={[
            {
              data: initialData?.map((data, index) => ({
                value: data.value,
                label: data.name,
                id: index,
              })),

              highlightScope: { fade: "series", highlight: "item" },
              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 5,
              cornerRadius: 5,
              startAngle: -90,
              endAngle: 180,
            },
          ]}
          slotProps={{
            legend: {
              position: { horizontal: "right", vertical: "middle" },
              itemMarkWidth: 15,
              itemMarkHeight: 15,
              labelStyle: {
                fontSize: 17,
                letterSpacing: 1,
              },
            },
          }}
        ></PieChart>
      </div>
    </div>
  );
};
