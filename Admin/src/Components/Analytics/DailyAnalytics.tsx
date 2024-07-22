import React, { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { CardAnalytics } from "../Common/Cards/AnalyticsCard";
import {
  CardAnalyticsProp,
} from "../../models/order.model";
import { getOrders } from "../../Services";
import { aggregateCurrentDayData } from "../../Utility/DateUtils";
import { MoreVertical } from "lucide-react";
// import { getOrders } from "../../Services";
// import { DailyAggregateData } from "../../models/order.model";
// import { aggregateCurrentDayData } from "../../Utility/DateUtils";



const Revenue: React.FC = () => {
  const [totalOrder, setTotalOrder] = useState<CardAnalyticsProp[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getOrders()
      .then((order) => {
        const currentData = aggregateCurrentDayData(order.data);
        if (currentData) setTotalOrder(currentData as CardAnalyticsProp[]);
        setLoading(false);
      })
      .catch((error) => {
        // throw new Error("Unable to aggregate current data" + error);
        console.log(error);
      });
    console.log("step");
    setLoading(false);
  }, []);
  // console.log(`Daily Aggregate data: ${totalOrder}`);
  console.log(loading);

  return (
    <React.Fragment>
      <div className="flex flex-wrap items-center justify-center w-full gap-3 px-5 xl:justify-start md:justify-between sm:justify-start sm:gap-5 ">
        {/* <div className="grid w-full grid-cols-1 md:flex-wrap md:justify-evenly sm:place-items-center lg:place-content-center md:flex md:items-center sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-3 xl:gap-x-10 gap-x-4 gap-y-6 "> */}
        {/* {totalOrder?.map((item, index) => { */}

        {/* })} */}
        <div className="flex flex-wrap items-center justify-start w-full gap-7 ">
          {loading
            ? "loadin..."
            : totalOrder?.map((order, index) => (
                <CardAnalytics
                  filter={
                    <span>
                      <MoreVertical />
                    </span>
                  }
                  title={order.title} 
                  total={order.total}
                  percentage={order.percentage}
                  subtitle={order.subtitle}
                  key={index}
                />
              ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Revenue;
