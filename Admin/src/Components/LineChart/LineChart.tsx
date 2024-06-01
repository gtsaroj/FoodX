import React, { useEffect, useRef } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { weekDateRoundUp } from "./LineChartData";

export const WeekOrderChart: React.FC = () => {
  return (
    <div className="w-full h-full">
      <LineChart
        xAxis={[
          {
            data: [...weekDateRoundUp()],
            scaleType: "point",
          },
        ]}
        series={[]}
        height={300}
        width={400}
      />
    </div>
  );
};

export const WeekReveneuChart: React.FC = () => {
  return <div></div>;
};

export const MonthlyOrderChart: React.FC = () => {
  return <div></div>;
};
export const MonthlyRevenueChart: React.FC = () => {
  return <div></div>;
};
