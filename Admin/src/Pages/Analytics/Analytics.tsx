import React, { useState } from "react";
// import Revenue from "../../Components/Analytics/DailyAnalytics";
// import { MonthlyOrderChart } from "../../Components/BarChart/BarChart";
// import Overview from "./Overview";
import Overview from "./Overview";
import ProductAnalytics from "./ProductAnalytics";
import Logs from "./Logs";
// import { MonthlyRevenueChart } from "../../Components/LineChart/LineChart";
// import { MonthlyOrderChart } from "../../Components/BarChart/BarChart";
// import { MonthlyAnalytics } from "../../Components/Analytics/MonthlyAnalytics";
// import { PieChartAnalytics } from "../../Components/PieChart/PieChart";
// import {  LineChartOfSellsOfAnalytics, LineChartRevenueOfAnalytics } from '../Components/LineChart/LineChart'

const Analytics: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    "Overview" | "Analytics" | "Logs"
  >("Overview");

  const onTabClick = (page: "Overview" | "Analytics" | "Logs") => {
    setCurrentPage(page);
  };
  return (
    <div className="flex flex-col items-center justify-center w-full gap-8 py-5">
      <div className="flex items-center justify-start w-full gap-5 text-xs text-[var(--dark-secondary-text)] border-b-2 border-b-[var(--light-border))] pb-2 px-7 lg:px-10">
        {/* tabs */}
        <p
          className={`relative cursor-pointer ${
            currentPage === "Overview"
              ? "text-[var(--primary-color)] font-semibold"
              : ""
          }`}
          onClick={() => onTabClick("Overview")}
        >
          Overview
          <span></span>
        </p>
        <p
          className={`relative cursor-pointer ${
            currentPage === "Analytics"
              ? "text-[var(--primary-color)] font-semibold"
              : ""
          }`}
          onClick={() => onTabClick("Analytics")}
        >
          Analytics
          <span></span>
        </p>
        <p
          className={`relative cursor-pointer ${
            currentPage === "Logs"
              ? "text-[var(--primary-color)] font-semibold"
              : ""
          }`}
          onClick={() => onTabClick("Logs")}
        >
          Logs
          <span></span>
        </p>
      </div>
      <div className="flex items-start justify-center w-full gap-8">
        {/* content */}
        {currentPage === "Overview" && <Overview />}
        {currentPage === "Analytics" && <ProductAnalytics />}
        {currentPage === "Logs" && <Logs />}
      </div>
      {/* <MonthlyAnalytics />
      <PieChartAnalytics />
      <MonthlyRevenueChart /> */}
    </div>
  );
};

export default Analytics;
