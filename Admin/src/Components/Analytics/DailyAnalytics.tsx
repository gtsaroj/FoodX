import React, { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { CardAnalytics } from "../Common/Analytics/CardAnalytics";
import { getOrders } from "../../Services";
import { DailyAggregateData } from "../../models/order.model";
import { aggregateCurrentDayData } from "../../Utility/DateUtils";

const Revenue: React.FC = () => {
  const [totalOrder, setTotalOrder] = useState<DailyAggregateData[]>();

  useEffect(() => {
    getOrders()
      .then((order) => {
        const currentData = aggregateCurrentDayData(order.data);
        console.log(currentData);
        if (currentData) setTotalOrder(currentData as DailyAggregateData[]);
      })
      .catch((error) => {
        // throw new Error("Unable to aggregate current data" + error);
        console.log(error)
      });
  }, []);
  return (
    <React.Fragment>
      <div className="flex w-full items-center flex-wrap  justify-center xl:justify-start md:justify-between sm:justify-start gap-3 sm:gap-5">
        <h2 className="w-full font-[600] brightness-100 contrast-125 py-2 text-xl text-[var(--primary-color)] ">
          Order Details
        </h2>
        <div className="w-full grid  md:flex-wrap md:justify-evenly sm:place-items-center lg:place-content-center md:flex md:items-center  sm:grid grid-cols-1 sm:grid-cols-2  lg:grid lg:grid-cols-3 xl:gap-x-10 gap-x-4 gap-y-6 ">
          {totalOrder?.map((item, index) => {
            return <CardAnalytics item={item} key={index} />;
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Revenue;
