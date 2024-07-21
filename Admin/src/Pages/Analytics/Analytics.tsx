import React from "react";
// import Revenue from "../../Components/Analytics/DailyAnalytics";
// import { MonthlyOrderChart } from "../../Components/BarChart/BarChart";
// import Overview from "./Overview";
import Overview from "./Overview";
// import { MonthlyRevenueChart } from "../../Components/LineChart/LineChart";
// import { MonthlyOrderChart } from "../../Components/BarChart/BarChart";
// import { MonthlyAnalytics } from "../../Components/Analytics/MonthlyAnalytics";
// import { PieChartAnalytics } from "../../Components/PieChart/PieChart";
// import {  LineChartOfSellsOfAnalytics, LineChartRevenueOfAnalytics } from '../Components/LineChart/LineChart'

const Analytics: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-8 py-5">
      <div className="flex items-center justify-start w-full gap-5 text-xs text-[var(--dark-secondary-text)] border-b-2 border-b-[var(--light-border))] pb-2 px-7 lg:px-10">
        {/* tabs */}
        <p className="relative cursor-pointer">
          Overview
          <span></span>
        </p>
        <p className="relative cursor-pointer">
          Analytics
          <span></span>
        </p>
        <p className="relative cursor-pointer">
          Website Analytic
          <span></span>
        </p>
        <p className="relative cursor-pointer">
          Logs
          <span></span>
        </p>
      </div>
      <div className="flex items-start justify-center w-full gap-8">
        {/* content */}
        <Overview />
        {/* <ProductAnalytics /> */}
      </div>
      {/* <MonthlyAnalytics />
      <PieChartAnalytics />
      <MonthlyRevenueChart /> */}
    </div>
  );
};

export default Analytics;
