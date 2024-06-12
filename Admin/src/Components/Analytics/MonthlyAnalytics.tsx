import React from "react";
import data from "../../data.json";
import { CardAnalytics } from "../Common/Analytics/CardAnalytics";
import Select from "react-select";
import { selectOptions } from "../LineChart/data";

export const MonthlyAnalytics: React.FC = () => {
  const { monthlyAnalyticsData } = data;

  return (
    <div className=" w-full flex  gap-3 flex-col items-end justify-center">
                  <h2 className="w-full text-left pb-4 text-xl text-[var(--primary-color)] ">
        Monthly & Weekly  Order
      </h2>
      <button className="sm:w-[200px] w-full  cursor-pointer">
        <Select className="" options={selectOptions}></Select>
      </button>
      <div className="w-full flex  flex-wrap items-center justify-center gap-5 sm:gap-11">
        {monthlyAnalyticsData?.map((item, index) => (
          <CardAnalytics item={item} key={index} />
        ))}
      </div>
    </div>
  );
};
