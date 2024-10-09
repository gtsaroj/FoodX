import { PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { Button } from "../Common/Button/Button";
import { Filter, MoveUp, X } from "lucide-react";
import dayjs from "dayjs";
import { getRevenue } from "../../Services/revenue.services";
import { AddRevenue } from "../../models/revenue.model";
import { aggregateDailyCategoryOrder } from "./PieData";
import { RotatingLines } from "react-loader-spinner";

export const PieChartAnalytics = () => {
  const [initialData, setInitialData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [filter, setIsFilter] = useState<{
    dateFilter?: { startDate: string; endDate: string };
    normalFilter?: string;
  }>();

  const getPiechartData = async ({ startDate, endDate }: AddRevenue) => {
    setLoading(true);
    try {
      const response = await getRevenue({
        startDate: startDate,
        endDate: endDate,
      });
      const aggregateData = await aggregateDailyCategoryOrder(response.data);

      setInitialData(aggregateData);
    } catch (error) {
      throw new Error("Error while fetching revenue" + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (filter?.normalFilter) {
      getPiechartData({
        startDate: dayjs()
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD"),
        endDate: dayjs()
          .subtract(1, "month")
          .endOf("month")
          .format("YYYY-MM-DD"),
      });
    } else {
      getPiechartData({
        startDate:
          (filter?.dateFilter?.startDate as string) ||
          dayjs().startOf("month").format("YYYY-MM-DD"),
        endDate: filter?.dateFilter?.endDate || dayjs().format("YYYY-MM-DD"),
      });
    }
  }, [
    filter?.normalFilter,
    filter?.dateFilter?.endDate,
    filter?.dateFilter?.startDate,
  ]);

  return (
    <div className="w-full h-[350px] px-5  p-3 gap-3 sm:h-[430px]">
      <div className="w-full  flex items-center justify-between ">
        <div className="flex w-full h-full gap-2 items-center justify-start">
          <span className="text-xl tracking-wider text-[var(--dark-text)]  ">
            Top Categories
          </span>
          <p className="text-[16px] tracking-wider h-full   text-[var(--green-text)]  flex justify-center items-center gap-0.5  rounded-lg">
            <span>10%</span>
            <span className="mb-[1px] ">
              <MoveUp strokeWidth={3} size={12} />
            </span>
          </p>
        </div>
        <Button
          bodyStyle={{
            width: "400px",
            top: "3rem",
            left: "-18rem",
          }}
          types={[{ label: "Previous", value: "previous", id: "fkldsj;fs" }]}
          parent={
            <div className="flex border-[1px] border-[var(--dark-border)] px-4 py-2 rounded items-center justify-start gap-2">
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
                  dateFilter: {
                    startDate: dayjs(firstDate).format("YYYY-MM-DD"),
                    endDate: dayjs(secondDate).format("YYYY-MM-DD"),
                  },
                }));
              }
            },
          }}
        />
      </div>
      <div className="flex pt-1  h-[10px] my-1 w-full    items-center justify-start gap-2">
        {filter?.dateFilter?.startDate && filter.dateFilter.endDate && (
          <div className="flex px-1   overflow-hidden py-0.5 gap-2 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] w-[180px] text-[var(--dark-secondary-text)]">
                {filter.dateFilter?.startDate +
                  " to " +
                  filter.dateFilter.endDate}
              </span>
            </div>
            <button
              onClick={() =>
                setIsFilter((prev) => ({
                  ...prev,
                  dateFilter: { endDate: "", startDate: "" },
                }))
              }
              className=" "
            >
              <X className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
        {filter?.normalFilter && (
          <div className="flex px-1 py-0.5 gap-2 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
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
      <div className="w-full h-full ">
        {loading ? (
          <div className="flex w-full h-full items-center justify-center gap-3">
            <RotatingLines strokeColor="var(--dark-text)" width="27" />
            <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
              {" "}
              loading...
            </span>
          </div>
        ) : (
          <PieChart
            sx={{
              cursor: "pointer",
              color: "white",
              "& .MuiChartsLabel": {
                fill: "white", // Set the label color to white
              },
            }}
            series={[
              {
                data: initialData?.map((data, index) => ({
                  value: data.value,
                  label: data.label.slice(0, 6),
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
                  fill: "var(--dark-text)",
                  fontSize: 17,
                  letterSpacing: 2,
                },
              },
            }}
          ></PieChart>
        )}
      </div>
    </div>
  );
};
