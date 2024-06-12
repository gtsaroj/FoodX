import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

interface CardAnalyticsProp {
  item: any;
}
export const CardAnalytics: React.FC<CardAnalyticsProp> = ({ item }) => {
  console.log(item)
  return (
    <div className=" flex sm:w-[200px]  w-full h-[130px] items-center justify-between gap-10 bg-[var(--light-background)] sm:px-3 px-8 py-4  rounded shadow-sm ">
      <div className="flex flex-col items-start justify-center gap-2">
        <p className="text-[15px] text-[var(--dark-text)] ">{item.title} </p>
        <p className="text-[25px] text-[var(--dark-foreground)]  font-bold ">
          {item.total}{" "}
        </p>
        <p className="text-[11px] text-[var(--dark-secondary-text)] ">
          {item.revenueInOneDay}
        </p>
      </div>
      <CircularProgressbar
        className="w-[80px] h-[80px]"
        strokeWidth={15}
        circleRatio={0.9}
        minValue={0}
        value={item.percentage}
        text={`${item.percentage}%`}
        styles={buildStyles({
          rotation: 0.25,
          strokeLinecap: "butt",
          textSize: "15px",
          pathTransitionDuration: 1,
          textColor: "var(--dark-text)",
          trailColor: "var(--light-background)",
          backgroundColor: "red",
          pathColor: `var(--primary-light)`,
        })}
      />
    </div>
  );
};
