import React from "react";
import {
  MonthlyOrderChart,
  MonthlyRevenueChart,
} from "../Components/LineChart/LineChart";
// import {  LineChartOfSellsOfAnalytics, LineChartRevenueOfAnalytics } from '../Components/LineChart/LineChart'

const Analytics: React.FC = () => {
  return (
    <div className="container flex flex-col items-center gap-16 justify-center py-5">
      <MonthlyOrderChart />
      <MonthlyRevenueChart />
    </div>
  );
};

export default Analytics;
