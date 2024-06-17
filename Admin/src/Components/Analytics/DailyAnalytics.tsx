import React from "react";
import "react-circular-progressbar/dist/styles.css";
import { CardAnalytics } from "../Common/Analytics/CardAnalytics";
import data from "../../data.json";

const Revenue: React.FC = () => {
  const { dailyAnalyticsData } = data;
  console.log(dailyAnalyticsData)
  return (
    <React.Fragment>
      <div className="flex w-full items-center flex-wrap  justify-center md:justify-between sm:justify-start gap-3 sm:gap-5">
      <h2 className="w-full  py-2 text-xl text-[var(--primary-color)] ">
        Order Details
      </h2>
        {dailyAnalyticsData?.map((item, index) => {
          return <CardAnalytics item={item} key={index} />;
        })}
      </div>
    </React.Fragment>
  );
};

export default Revenue;
