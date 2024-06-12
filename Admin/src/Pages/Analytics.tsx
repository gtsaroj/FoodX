import React from "react";
import { MonthlyRevenueChart } from "../Components/LineChart/LineChart";
import { MonthlyOrderChart } from "../Components/BarChart/BarChart";
import { MonthlyAnalytics } from "../Components/Analytics/MonthlyAnalytics";
import { PieChartAnalytics } from "../Components/PieChart/PieChart";
// import {  LineChartOfSellsOfAnalytics, LineChartRevenueOfAnalytics } from '../Components/LineChart/LineChart'

const Analytics: React.FC = () => {
  return (
    <div className="w-full 2xl:container flex flex-col items-center gap-10 sm:gap-16 justify-center py-5">
      <MonthlyAnalytics />
      <PieChartAnalytics />
      <MonthlyOrderChart />
      <MonthlyRevenueChart />
    </div>
  );
};

export default Analytics;
