import React from "react";
import data from "../../data.json";
import { CardAnalytics } from "../Common/Analytics/CardAnalytics";
import Select from "react-select";
import { selectOptions } from "../LineChart/data";

export const MonthlyAnalytics: React.FC = () => {
  const { monthlyAnalyticsData } = data;

  return (
    <div className=" w-full flex  gap-3 flex-col items-start justify-center">
      <h2 className="w-full text-left px-3 py-2 text-xl text-[var(--primary-color)] ">
        Order Details
      </h2>
      <button className="sm:w-[200px] w-full  cursor-pointer">
        <Select className="" options={selectOptions}></Select>
      </button>
      <div className="w-full flex  flex-wrap items-center justify-between gap-5 sm:gap-11">
        {monthlyAnalyticsData?.map((item, index) => (
          <CardAnalytics item={item} key={index} />
        ))}
      </div>
    </div>
  );
};
