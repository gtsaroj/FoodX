import { BarChart } from "@mui/x-charts";
import React from "react";
import { orderCharts, orderChartsOfMonthly } from "../LineChart/data";

export const BarChartOfWeeklyOrder: React.FC = () => {
  const valueFormatter = (value: number | null) => value;
  return (
    <div className="bg-[var(--light-background)] rounded py-2 w-full lg:w-[600px] h-[300px] sm:h-[400px] flex  flex-col items-start px-2 justify-center">
      <h2 className="text-xl text-[var(--primary-color)] ">Weekly Orders</h2>
      <BarChart
        slotProps={{
          legend: { hidden: true },
        }}
        xAxis={[{ scaleType: "band", disableLine: true, dataKey: "day" }]}
        dataset={orderCharts} // Ensure this is correctly formatted
        series={[
          {
            label: "Samosa",
            dataKey: "samosa",
            valueFormatter,
          },
          {
            label: "Cold Drinks",
            dataKey: "cold_drinks",
            valueFormatter,
          }, // Added type property
          {
            label: "Momo",
            dataKey: "momo",
            valueFormatter,
          },
          {
            label: "Others",
            dataKey: "others",
            valueFormatter,
          },
        ]}
        sx={{
          width: 100,
          strokeWidth: 1,
          cursor: "pointer",
        }}
      ></BarChart>
    </div>
  );
};

export const MonthlyOrderChart: React.FC = () => {
  const valueFormatter = (value: number | null) => value;
  return (
    <div className="w-full h-[300px] bg-[var(--light-background)] px-2 sm:h-[400px] py-5">
      <h2 className="w-full text-left text-xl pb-4 text-[var(--primary-color)] ">
        Monthly Revenue
      </h2>
      <BarChart
        slotProps={{
          legend: {
            hidden: true,
            itemMarkHeight: 10,
            labelStyle: { fontSize: "10px", alignItems: "center" },
            direction: "row",
            position: { vertical: "bottom", horizontal: "middle" },
          },
        }}
        dataset={orderChartsOfMonthly}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "week",
          },
        ]}
        series={[
          {
            dataKey: "samosa",
            label: "Samosa",
            valueFormatter,
          },
          {
            dataKey: "pizza",
            label: "Pizza",
            valueFormatter,
          },
          {
            dataKey: "cold_drinks",
            label: "Cold Drinks",
            valueFormatter,
          },
          {
            dataKey: "others",
            label: "Others",
            valueFormatter,
          },
        ]}
      />
    </div>
  );
};
