import { LineChart } from "@mui/x-charts";
import { ArrowUp, Filter } from "lucide-react";
import "./LineChart.css";
import {
  weekOrderRevenue as orderRevenue,
  previousOrderRevenue,
} from "../../data.json";
import { useEffect, useState } from "react";
import { Button } from "../Common/Button/Button";
import { Dayjs } from "dayjs";


interface MonthlyLineChartProps {
  dateRange: { startDate: Dayjs; endDate: Dayjs };
}
export const WeekReveneuChart: React.FC = () => {
  // const [initialData, setInitialData] = useState<any>(orderRevenue);
  const [prevData, setPrevData] = useState<any>([]);


  const handleSelect = (value: string) => {
    if (value === "Last week") {
      setPrevData(previousOrderRevenue);
    }
    if (value === "Current week") {
      setPrevData([]);
    }
  };

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
        <div>
          <Button
            parent={
              <button
                className="flex w-full duration-150 hover:text-[var(--dark-text)] text-[var(--dark-secondary-text)] items-center gap-1.5 p-2 rounded 
               justify-center"
              >
                <Filter className="size-5" />
                <span className=" text-[17px] tracking-wider ">
                  Filter
                </span>
              </button>
            }
            children={["Last week", "This week"]}
            onSelect={(value) => handleSelect(value)}
          />
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
              data: orderRevenue?.map((order) => order["week"]),
              scaleType: "point",
            },
          ]}
          series={[
            {
              data: orderRevenue?.map((order) => order["revenue"]),
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

export const MonthlyRevenueChart : React.FC<MonthlyLineChartProps> = ({dateRange}) => {
  const [prevData, setPrevData] = useState<any>([]);


  const handleSelect = (value: string) => {
    if (value === "Last Month") {
      setPrevData(previousOrderRevenue);
    }
    if (value === "Current week") {
      setPrevData([]);
    }
  };

  useEffect(() => {
    
  },[dateRange.startDate, dateRange.endDate])

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
      <div>
        <Button
          parent={
            <button
              className="flex w-full duration-150 hover:text-[var(--dark-text)] text-[var(--dark-secondary-text)] items-center gap-1.5 p-2 rounded 
             justify-center"
            >
              <Filter className="size-5" />
              <span className=" text-[17px] tracking-wider ">
                Filter
              </span>
            </button>
          }
          children={["Last week", "This week"]}
          onSelect={(value) => handleSelect(value)}
        />
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
            data: orderRevenue?.map((order) => order["week"]),
            scaleType: "point",
          },
        ]}
        series={[
          {
            data: orderRevenue?.map((order) => order["revenue"]),
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
  )

};

