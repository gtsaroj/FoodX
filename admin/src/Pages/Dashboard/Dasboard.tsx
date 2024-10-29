import React from "react";
import Revenue from "../../Components/Analytics/DailyAnalytics.tsx";
// import PieChartComponent from "../../Components/PieChart/PieChart.tsx";
// import { WeekReveneuChart } from "../../Components/LineChart/LineChart.tsx";
// import { BarChartOfWeeklyOrder } from "../../Components/BarChart/BarChart.tsx";
import { RecentOrders } from "../../Components/Order/Order.tsx";
import { RecentTickets } from "../../Components/Tickets/RecentTickets.tsx";
import { TopCustomers } from "./TopCustomers.tsx";
// import WeekRevenue from "../../Components/LineChart/WeekRevenue.tsx";
import { WeekReveneuChart } from "../../Components/LineChart/LineChart.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../Store.ts";

// import {
//   LineChartOfOrder,
//   LineChartOfRevenue,
// } from "../Components/LineChart/LineChart";

const Dasboard: React.FC = () => {

  const user = useSelector((state: RootState) => state.root.user);
  return (
 user?.success &&    <div className="flex flex-col  items-center justify-center w-full gap-16 px-3 py-5 pb-5 2xl:container">
 <Revenue />
 <div className="flex flex-col h-full items-start justify-between w-full px-3 gap-7 lg:flex-row">
   <RecentOrders />
   <RecentTickets />
 </div>
 <div className="flex flex-col items-center justify-between w-full px-5 gap-7 md:flex-row">
   <div className="flex  w-full border-[var(--dark-border)] border-[1px] rounded-lg">
     <WeekReveneuChart />
   </div>
   {user?.userInfo?.role === "admin" && (
     <div className="hidden min-w-[350px] lg:block">
       <TopCustomers />
     </div>
   )}
 </div>
</div>
  );
};

export default Dasboard;
