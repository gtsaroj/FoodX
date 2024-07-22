import React, { useEffect, useState } from "react";
import { DropDown } from "../Common/DropDown/DropDown";
import { DailyAggregateData } from "../../models/order.model";
import { getOrders } from "../../Services";
import { aggregateWeeklyData } from "../../Utility/DateUtils";
import { Filter } from "lucide-react";

export const MonthlyAnalytics: React.FC = () => {
  const [weeklyFilterOrder, setWeeklyFilterOrder] =
    useState<DailyAggregateData[]>();
  console.log(weeklyFilterOrder);
  // const handleSelect = async (option: string) => {
  //   try {
  //     const orders = await getOrders();

  //     const filterData = aggregateWeeklyData(orders.data, option.toLowerCase());
  //     console.log(orders);
  //     setWeeklyFilterOrder(filterData);
  //   } catch (error) {
  //     throw new Error("Unable to filtered weekly data" + error);
  //   }
  // };

  useEffect(() => {
    getOrders().then((data) => {
      const filterData = aggregateWeeklyData(data.data, "current week");
      setWeeklyFilterOrder(filterData);
    });
  }, []);

  return (
    <div className=" w-full flex  gap-4 flex-col items-start justify-center">
      <div className="w-full flex items-center px-5  justify-between">
        <h2 className="text-left text-xl text-[var(--primary-color)] ">
          Order Details
        </h2>
        <DropDown
          style={{
            display: "flex",
            fontSize: "15px",
            borderRadius: "4px",
            padding: "0.5rem 1rem 0.5rem 1rem",
            color: "var(--dark-text)",
            border: "1px solid var(--dark-secondary-text)  ",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            background: "",
          }}
          children={
            <>
              <Filter className="size-4" />
              <span>Filter</span>
            </>
          }
          options={["Current Week", "1 week ago"]}
        />
      </div>
      <div className="w-full grid  md:flex-wrap md:justify-evenly sm:place-items-center lg:place-content-center md:flex md:items-center  sm:grid grid-cols-1 sm:grid-cols-2  lg:grid lg:grid-cols-2 xl:gap-x-10 gap-x-4 gap-y-6 ">
        {/* { weeklyFilterOrder?.map((item, index) => (
          <div className="col-span-1">
            <CardAnalytics prop={item} key={index} />
          </div>
        ))} */}
      </div>
    </div>
  );
};
