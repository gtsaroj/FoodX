import React from "react";
import Revenue from "../Components/Analytics/DailyAnalytics";
import PieChartComponent from "../Components/PieChart/PieChart";
import { WeekReveneuChart } from "../Components/LineChart/LineChart.tsx";
import { BarChartOfWeeklyOrder } from "../Components/BarChart/BarChart";
import { getOrders, getOrderByUser } from "../Services";

// import {
//   LineChartOfOrder,
//   LineChartOfRevenue,
// } from "../Components/LineChart/LineChart";

const Dasboard: React.FC = () => {
  (getOrderByUser().then((res)=>console.log(res)))
  return (
    <div className="2xl:container w-full pb-5  py-5  flex flex-col items-center justify-center  gap-16 ">
      <Revenue />
      <div className="w-full gap-2  flex lg:flex-row flex-col items-center lg:justify-between lg:px-9 xl:px-0 justify-evenly  ">
        <PieChartComponent  />
        <BarChartOfWeeklyOrder />
      </div>
      <WeekReveneuChart/>
    </div>
  );
};

export default Dasboard;
