import React from "react";
import "react-circular-progressbar/dist/styles.css";
import { CardAnalytics } from "../Common/Analytics/CardAnalytics";
import data from "../../data.json";

const Revenue: React.FC = () => {
  const { dailyAnalyticsData } = data;
  console.log(dailyAnalyticsData)
  return (
    <React.Fragment>
      <div className="flex w-full items-center flex-wrap  justify-center xl:justify-start md:justify-between sm:justify-start gap-3 sm:gap-5">
      <h2 className="w-full  py-2 text-xl text-[var(--primary-color)] ">
        Order Details
      </h2>
        <div className="w-full grid  md:flex-wrap md:justify-evenly sm:place-items-center lg:place-content-center md:flex md:items-center  sm:grid grid-cols-1 sm:grid-cols-2  lg:grid lg:grid-cols-3 xl:gap-x-10 gap-x-4 gap-y-6 ">
        {dailyAnalyticsData?.map((item, index) => {
          return <CardAnalytics item={item} key={index} />;
        })}
         </div>
      </div>
    </React.Fragment>
  );
};

export default Revenue;
