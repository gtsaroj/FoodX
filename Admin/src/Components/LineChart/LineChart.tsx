import { LineChart } from "@mui/x-charts";
import { ArrowUp, Filter } from "lucide-react";
import "./LineChart.css";
import { chartData } from "../../data.json";
import { useEffect, useState } from "react";
import { Button } from "../Common/Button/Button";
import { Dayjs } from "dayjs";
import { monthlyRevenue, monthlyTotal, weeklyRevenue } from "./LineChartData";

interface MonthlyLineChartProps {
  dateRange: { startDate: Dayjs; endDate: Dayjs };
}
export const WeekReveneuChart: React.FC = () => {
  const [initialData, setInitialData] =
    useState<{ time: string; revenue: number }[]>();
  const [prevData, setPrevData] = useState<any>([]);

  useEffect(() => {
    const revenue = weeklyRevenue(chartData);
    setInitialData(revenue);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-5 px-3 py-5 rounded">
      <div className="flex items-center justify-between w-full gap-3 px-2">
        <div className="text-left text-xl text-[var(--dark-text)] flex justify-center items-center gap-3">
          <p className="text-nowrap">Weekly Revenue</p>
          <p className="text-sm text-[var(--green-text)] p-1 flex justify-center items-center gap-0.5 border border-[var(--green-text)] rounded-lg">
            10%
            <span>
              <ArrowUp size={15} />
            </span>
          </p>
        </div>
      </div>
      <div className="h-[400px] lg:h-[300px] w-full">
        <LineChart
          slotProps={{
            legend: {
              direction: "row",
              labelStyle: { fontSize: "14px" },
              position: { vertical: "bottom", horizontal: "middle" },
            },
          }}
          xAxis={[
            {
              data: initialData?.map((order) => order["time"]),
              scaleType: "point",
            },
          ]}
          series={[
            {
              data: initialData?.map((order) => order["revenue"]),
              type: "line",
              color: "#45c241",
            },
            prevData && {
              data: prevData?.map((order: any) => order["revenue"]),
              type: "line",
              color: "red",
            },
          ]}
          grid={{ vertical: true, horizontal: true }}
        ></LineChart>
      </div>
    </div>
  );
};

export const MonthlyRevenueChart: React.FC<MonthlyLineChartProps> = ({
  dateRange,
}) => {
  const [initialData, setInitialData] =
    useState<{ time: string; revenue: number }[]>();

  useEffect(() => {
    const monthlyData = monthlyRevenue(chartData);
    setInitialData(monthlyData);
  }, []);

  // useEffect(() => {}, [dateRange.startDate, dateRange.endDate]);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-5 px-3 py-5 rounded">
      <div className="flex items-center justify-between w-full gap-3 px-2">
        <div className="text-left text-xl text-[var(--dark-text)] flex justify-center items-center gap-3">
          <p className="text-nowrap">Weekly Revenue</p>
          <p className="text-sm text-[var(--green-text)] p-1 flex justify-center items-center gap-0.5 border border-[var(--green-text)] rounded-lg">
            10%
            <span>
              <ArrowUp size={15} />
            </span>
          </p>
        </div>
        <Button
          bodyStyle={{
            width: "400px",
            top: "3rem",
            left: "-18rem",
          }}
          types={[
            { label: "Previous week", value: "previousweek", id: "8933840fhn" },
            { label: "Date", id: "fdsljfdsijw092", value: "date" },
          ]}
          checkFn={{
            checkTypeFn: (isChecked: boolean, value: string) =>
              console.log(isChecked, value),
          }}
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
        />
      </div>
      <div className="h-[400px] lg:h-[300px] w-full">
        <LineChart
          slotProps={{
            legend: {
              direction: "row",
              labelStyle: { fontSize: "14px" },
              position: { vertical: "bottom", horizontal: "middle" },
            },
          }}
          xAxis={[
            {
              data: initialData?.map((order) => order["time"]),
              scaleType: "point",
            },
          ]}
          series={[
            {
              data: initialData?.map((order) => order["revenue"]),
              type: "line",
              color: "#45c241",
            },
          ]}
          grid={{ vertical: true, horizontal: true }}
        ></LineChart>
      </div>
    </div>
  );
};

export const MonthlyOrderLinechart: React.FC<MonthlyLineChartProps> = ({
  dateRange,
}) => {
  const [initialData, setInitialData] =
    useState<{ time: string; orders: number }[]>();

  useEffect(() => {
    const monthlyData = monthlyTotal(chartData);
    setInitialData(monthlyData);
  }, []);

  // useEffect(() => {}, [dateRange.startDate, dateRange.endDate]);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-5 px-3 py-5 rounded">
      <div className="flex items-center justify-between w-full gap-3 px-2">
        <div className="text-left text-xl text-[var(--dark-text)] flex justify-center items-center gap-3">
          <p className="text-nowrap">Weekly Order</p>
          <p className="text-sm text-[var(--green-text)] p-1 flex justify-center items-center gap-0.5 border border-[var(--green-text)] rounded-lg">
            10%
            <span>
              <ArrowUp size={15} />
            </span>
          </p>
        </div>
        <Button
          bodyStyle={{
            width: "400px",
            top: "3rem",
            left: "-18rem",
          }}
          types={[
            { label: "Previous week", value: "previousweek", id: "8933840fhn" },
            { label: "Date", id: "fdsljfdsijw092", value: "date" },
          ]}
          checkFn={{
            checkTypeFn: (isChecked: boolean, value: string) =>
              console.log(isChecked, value),
          }}
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
        />
      </div>
      <div className="h-[400px] lg:h-[300px] w-full">
        <LineChart
          slotProps={{
            legend: {
              direction: "row",
              labelStyle: { fontSize: "14px" },
              position: { vertical: "bottom", horizontal: "middle" },
            },
          }}
          xAxis={[
            {
              data: initialData?.map((order) => order["time"]),
              scaleType: "point",
            },
          ]}
          series={[
            {
              data: initialData?.map((order) => order["orders"]),
              type: "line",
              color: "#45c241",
            },
          ]}
          grid={{ vertical: true, horizontal: true }}
        ></LineChart>
      </div>
    </div>
  );
};
