import React from "react";
import "react-circular-progressbar/dist/styles.css";
import { CardAnalytics } from "../Common/Cards/AnalyticsCard";

import Skeleton from "react-loading-skeleton";
import { getRevenue } from "../../Services/revenue.services";
import dayjs from "dayjs";
import { aggregateCurrentDayData } from "./Analtytics";
import { useQuery } from "react-query";
import { CardAnalytic } from "../../models/product.model";

const Revenue: React.FC = () => {
  const getDailyData = async (): Promise<CardAnalytic[] | null> => {
    try {
      const response = await getRevenue({
        startDate: dayjs().subtract(1, "week").format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
      });
      const responseData = response.data;
      const analyticsData = aggregateCurrentDayData(responseData);
      return analyticsData || null;
    } catch (error) {
      throw new Error("Error while fetching revenue " + error);
    }
  };

  const { data, isLoading } = useQuery("analytics:daily", getDailyData, {
    cacheTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  

  return (
    <React.Fragment>
      <div className="flex  items-center flex-wrap justify-center w-full gap-3 px-5 xl:justify-start md:justify-between sm:justify-start sm:gap-5 ">
        {/* <div className="grid w-full grid-cols-1 md:flex-wrap md:justify-evenly sm:place-items-center lg:place-content-center md:flex md:items-center sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-3 xl:gap-x-10 gap-x-4 gap-y-6 "> */}
        {/* {totalOrder?.map((item, index) => { */}

        {/* })} */}
        <div className="flex md:flex-row md:flex-wrap flex-nowrap flex-col  items-center justify-start w-full gap-7 ">
          {!isLoading ? (
            data?.map((order, index) => (
              <CardAnalytics
                title={order.title}
                total={order.total}
                percentage={order.percentage as number}
                subtitle={order.subtitle}
                key={index}
              />
            ))
          ) : (
            <div className="w-full grid grid-cols-3 gap-3 ">
              <Skeleton
                height={200}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
              <Skeleton
                height={200}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
              <Skeleton
                height={200}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Revenue;
