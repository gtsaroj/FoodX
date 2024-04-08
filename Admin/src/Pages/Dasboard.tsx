import React from "react";
import Slider from "../Components/Slider/Slider";
import Revenue from "../Components/Revenue/Revenue";
import PieChart from "../Components/PieChart/PieChart";

const Dasboard = () => {
  return (
    <div className="w-full items-center justify-center flex gap-5">
      <Slider />
      <div className="w-full bg-[var(--light-foreground)] ">
              <Revenue />
              <PieChart/>
      </div>
    </div>
  );
};

export default Dasboard;
