import React, { useEffect, useState } from "react";
import data from "../../data.json";
import { CardAnalytics } from "../Common/Analytics/CardAnalytics";
import Select from "react-select";
import { selectOptions } from "../LineChart/data";
import { DropDown } from "../Common/DropDown/DropDown";
import { DailyAggregateData } from "../../models/order.model";
import { getOrders } from "../../Services";
import { aggregateWeeklyData } from "../../Utility/DateUtils";

export const MonthlyAnalytics: React.FC = () => {
  const [weeklyFilterOrder, setWeeklyFilterOrder] =
    useState<DailyAggregateData[]>();
  const handleSelect = async (option: string) => {
    try {
      const orders = await getOrders();

      const filterData = aggregateWeeklyData(orders.data, option.toLowerCase());
      console.log(orders);
      setWeeklyFilterOrder(filterData);
    } catch (error) {
      throw new Error("Unable to filtered weekly data" + error);
    }
  };

  useEffect(() => {
    getOrders().then((data) => {
      const filterData = aggregateWeeklyData(data.data, "current week");
      setWeeklyFilterOrder(filterData);
    });
  }, []);

  return (
    <div className=" w-full flex  gap-4 flex-col items-start justify-center">
      <h2 className="w-full text-left text-xl text-[var(--primary-color)] ">
        Order Details
      </h2>
      <DropDown
        onSelect={handleSelect}
        options={["Current week", "Previous week"]}
      />
      <div className="w-full grid  md:flex-wrap md:justify-evenly sm:place-items-center lg:place-content-center md:flex md:items-center  sm:grid grid-cols-1 sm:grid-cols-2  lg:grid lg:grid-cols-3 xl:gap-x-10 gap-x-4 gap-y-6 ">
        { weeklyFilterOrder?.map((item, index) => (
          <div className="col-span-1">
            <CardAnalytics item={item} key={index} />
          </div>
        ))}
      </div>
    </div>
  );
};
