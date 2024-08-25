import React, { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { CardAnalytics } from "../Common/Cards/AnalyticsCard";
import { CardAnalyticsProp } from "../../models/order.model";
import { EllipsisVertical } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { Button } from "../Common/Button/Button";
import { aggregateCurrentDayData } from "./Analtytics";
import { getAllOrder } from "../../Services/order.services";
import toast from "react-hot-toast";

export const MonthlyAnalytics: React.FC = () => {
  const [totalOrder, setTotalOrder] = useState<CardAnalyticsProp[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getAllOrder()
      .then((order) => {
        const currentData = aggregateCurrentDayData(order);
        if (currentData) setTotalOrder(currentData as CardAnalyticsProp[]);
        setLoading(false);
      })
      .catch((error) => {
        throw new Error(
          "Unable to aggregate current data file: dailAnalytics " + error
        );
      });
    setLoading(false);
  }, []);

  function handleSelect(value: string) {
    throw new Error("Function not implemented.");
  }

  return (
    <React.Fragment>
      <div className="flex  flex-wrap items-center justify-center w-full gap-3 px-5 xl:justify-start md:justify-between sm:justify-start sm:gap-5 ">
        {/* <div className="grid w-full grid-cols-1 md:flex-wrap md:justify-evenly sm:place-items-center lg:place-content-center md:flex md:items-center sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-3 xl:gap-x-10 gap-x-4 gap-y-6 "> */}
        {/* {totalOrder?.map((item, index) => { */}

        {/* })} */}
        <div className="flex flex-wrap items-center justify-start w-full gap-7 ">
          {totalOrder?.length > 0 ? (
            totalOrder?.map((order, index) => (
              <CardAnalytics
                filter={
                  <Button
                    types={[
                      {
                        label: "Previous",
                        value: "previous",
                        id: "fush9uwoj39",
                      },
                    ]}
                    checkFn={{
                      checkTypeFn: (isChecked, value) => {
                        if (isChecked) toast.success("fn not implemented");
                      },
                      dateActionFn: (firstDate, secondDate) =>
                        console.log(firstDate, secondDate),
                    }}
                    bodyStyle={{
                      width: "350px",
                      top: "1.6rem",
                      left: "-20.8rem",
                      zIndex: 10000,
                    }}
                    parent={
                      <EllipsisVertical className="text-[var(--dark-text)] " />
                    }
                  />
                }
                title={order.title}
                total={order.total}
                percentage={order.percentage}
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
