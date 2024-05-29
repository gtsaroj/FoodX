import React from "react";
import Revenue from "../Components/Revenue/Revenue";
import PieChart from "../Components/PieChart/PieChart";
import {
  LineChartOfOrder,
  LineChartOfRevenue,
} from "../Components/LineChart/LineChart";

const Dasboard: React.FC = () => {
  return (
    <div className="2xl:container w-full pb-5 lg:px-8 py-5  flex flex-col items-center justify-center  gap-16 ">
      <Revenue />
      <div className="w-full gap-2 flex lg:flex-row flex-col items-center justify-center  ">
        <PieChart  />
        <LineChartOfOrder />
      </div>
      <LineChartOfRevenue />
    </div>
  );
};

export default Dasboard;
