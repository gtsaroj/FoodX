import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

interface CardAnalyticsProp {
  item: any;
}
export const CardAnalytics: React.FC<CardAnalyticsProp> = ({ item }) => {
  console.log(item)
  return (
    <div className=" flex px-8  h-[160px]  w-[300px] items-center justify-between gap-10 bg-[var(--light-background)]   rounded shadow-inner ">
      <div className="flex flex-col items-start justify-center gap-2">
        <p className="text-[18px] font-semibold  text-[var(--primary-color)] ">{item.title} </p>
        <p className="text-[25px] text-[var(--dark-foreground)]  font-bold ">
          {item.total}{" "}
        </p>
        <p className="text-[11px] text-[var(--dark-secondary-text)] ">
          {item.revenueInOneDay}
        </p>
      </div>
      <div className="w-[100px]">
      <CircularProgressbar
        className="w-full h-full"
        strokeWidth={15}
        circleRatio={0.9}
        minValue={0}
        value={item.percentage}
        text={`${item.percentage}%`}
        styles={ buildStyles({
          rotation: 0.25,
          textSize: "17px",
          pathTransitionDuration: 1,
          textColor: "var(--dark-text)",
          trailColor: "var(--light-background)",
          backgroundColor: "red",
          pathColor: `var(--primary-dark)`,
          
        })}
      />
  </div>
    </div>
  );
};
