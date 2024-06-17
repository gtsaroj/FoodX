import React from "react";
import { LineChart } from "@mui/x-charts";
import Select from "react-select";
import { selectOptions } from "./data";
import { ArrowUp } from "lucide-react";
import "./LineChart.css";

export const WeekReveneuChart: React.FC = () => {
  // const svgHeight = useDrawingArea();
  // const yScale = useYScale();
  return (
    <div className="w-full bg-[var(--light-background)] h-[250px] sm:h-[400px] pt-2 pb-16 sm:px-5 rounded">
      <h2 className="w-full p-2 text-left text-xl text-[var(--primary-color)] ">
        Weekly Revenue
      </h2>
      <div className="w-full flex p-2 items-center justify-between">
        <button className="w-[200px] cursor-pointer">
          <Select className="" options={selectOptions}></Select>
        </button>
        <h1 className="  font-bold text-[#459142] text-[16px] flex items-start gap-1 justify-center ">
          <span>12.5%</span>
          <ArrowUp className="size-5" />
        </h1>
      </div>
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
            data: [0, 1, 2, 3, 4, 5],
            scaleType: "point",
          },
        ]}
        series={[
          {
            data: [0, 300, 400, 200, 150, 290],
            type: "line",
            color: "#478612a1",
          },
        ]}
      ></LineChart>
    </div>
  );
};

export const MonthlyRevenueChart: React.FC = () => {
  return (
    <div className="w-full px-2 py-5 h-[250px] sm:h-[400px] bg-[var(--light-background)] ">
      <h2 className="w-full px-3 text-left pb-4  text-xl text-[var(--primary-color)] ">Monthly Revenue</h2>
      <LineChart
        xAxis={[
          {
            data: [1, 2, 3, 4, 5, 6, 7],
            scaleType: "point",
          },
        ]}
        series={[
          {
            data: [1000, 1500, 1350, 1600, 1700, 1512, 1500],
          },
        ]}
      />
    </div>
  );
};
