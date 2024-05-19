import React from "react";
import Revenue from "../Components/Revenue/Revenue";
import PieChart from "../Components/PieChart/PieChart";
import {
  LineChartOfOrder,
  LineChartOfRevenue,
} from "../Components/LineChart/LineChart";

const Dasboard: React.FC = () => {
  return (
    <div className="container pb-5  flex flex-col items-center justify-center  gap-16 ">
      <Revenue />
      <div className="container flex items-center justify-center  gap-36 ">
        <PieChart />
        <LineChartOfOrder />
      </div>
      <LineChartOfRevenue />
    </div>
  );
};

export default Dasboard;
