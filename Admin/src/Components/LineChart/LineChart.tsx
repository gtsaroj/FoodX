import React, { useEffect, useRef } from "react";
import {
  LineChart,
  BarChart,
  LinePlot,
  ResponsiveChartContainer,
  ChartsYAxis,
  ChartsXAxis,
  HighlightedContext,
} from "@mui/x-charts";
import Box from "@mui/material/Box";
import { weekDateRoundUp } from "./LineChartData";

export const WeekOrderChart: React.FC = () => {
  return (
    <div className="xl:w-[500px] w-full bg-slate-500 py-4 flex items-center justify-center h-full">
      <ResponsiveChartContainer

        
      >
       <LinePlot
            
          />
      </ResponsiveChartContainer>
    </div>
  );
};

export const WeekReveneuChart: React.FC = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <div className="w-full flex items-center bg-gray-600 justify-center h-full">
        <ResponsiveChartContainer
          xAxis={[{ data: [1, 2, 3, 4, 5, 7], scaleType: "band" }]}
          series={[
            {
              data: [100, 300, 400, 200, 150, 290],
              area: true,
              color: "blue",
              
              type: "line",
            },
          ]}
          sx={{
            cursor: "pointer",
            background: "linear-gradient(red, yellow)",
          }}
          height={400}
          width={800}
          disableAxisListener={false}
        >
          <LinePlot type="monotone" />
          <ChartsYAxis />
          <ChartsXAxis />
        </ResponsiveChartContainer>
      </div>
    </Box>
  );
};

export const MonthlyOrderChart: React.FC = () => {
  return (
    <div>
      <BarChart
        xAxis={[
          {
            data: [1, 2, 3, 4, 5, 6, 7],
            scaleType: "band",
          },
        ]}
        series={[
          {
            data: [1000, 1500, 1350, 1600, 1700, 1512, 1500],
            type: "bar",
          },
        ]}
        height={300}
        width={700}
      />
    </div>
  );
};
export const MonthlyRevenueChart: React.FC = () => {
  return (
    <div className="w-ful h-full">
      <LineChart
        xAxis={[
          {
            data: [1, 2, 3, 4, 5, 6, 7],
            scaleType: "band",
          },
        ]}
        series={[
          {
            data: [1000, 1500, 1350, 1600, 1700, 1512, 1500],
            type: "line",
          },
        ]}
        height={300}
        width={700}
      />
    </div>
  );
};
