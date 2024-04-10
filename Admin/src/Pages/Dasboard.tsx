import React from "react";
import Slider from "../Components/Slider/Slider";
import Revenue from "../Components/Revenue/Revenue";
import PieChart from "../Components/PieChart/PieChart";
import LineChart from "../Components/LineChart/LineChart";

const Dasboard  : React.FC = () => {
  return (
    <div className="w-full items-center justify-center flex gap-5">
      <Slider />
      <div className="w-full bg-[var(--light-foreground)] ">
              <Revenue />
        <div className="w-full flex ic justify-center gap-10 ">
          <PieChart />
          <LineChart/>
  </div>
      </div>
    </div>
  );
};

export default Dasboard;
