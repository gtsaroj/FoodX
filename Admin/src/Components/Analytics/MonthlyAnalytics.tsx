import React, { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { CardAnalytics } from "../Common/Cards/AnalyticsCard";
import { CardAnalyticsProp } from "../../models/order.model";
import { Filter, X } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { Button } from "../Common/Button/Button";
import { getRevenue } from "../../Services/revenue.services";
import dayjs from "dayjs";
import { aggregateCurrentDayData } from "./Analtytics";
import { AddRevenue } from "../../models/revenue.model";

export const MonthlyAnalytics: React.FC = () => {
  const [totalOrder, setTotalOrder] = useState<CardAnalyticsProp[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [filter, setFilter] = useState<{
    dateFilter?: { startDate: string; endDate: string };
    normalFilter?: string;
  }>();

  const getDailyData = async (data: AddRevenue) => {
    setLoading(true);
    try {
      const response = await getRevenue({
        startDate: data.startDate,
        endDate: data.endDate,
      });
      const responseData = response.data;
      const analyticsData = aggregateCurrentDayData(responseData);
      setTotalOrder(analyticsData as CardAnalyticsProp[]);
    } catch (error) {
      throw new Error("Error while fetching revenue " + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDailyData({
      startDate:
        filter?.normalFilter ||
        filter?.dateFilter?.startDate ||
        dayjs().subtract(1, "month").format("YYYY-MM-DD"),
      endDate:
        filter?.normalFilter ||
        filter?.dateFilter?.endDate ||
        dayjs().format("YYYY-MM-DD"),
    });
  }, [
    filter?.dateFilter?.startDate,
    filter?.dateFilter?.endDate,
    filter?.normalFilter,
  ]);

  return (
    <React.Fragment>
      <div className="flex items-end  justify-start flex-col gap-4 ">
        <div className="w-full flex items-center justify-between ">
          <div className="flex  pt-1 h-[10px]  w-full  items-center justify-start gap-2">
            {filter?.dateFilter?.startDate && filter.dateFilter.endDate && (
              <div className="flex px-1 overflow-hidden py-0.5 gap-2 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
                <div className="flex gap-1  w-full items-center justify-center">
                  <span className="text-[15px] w-[180px]   text-[var(--dark-secondary-text)]">
                    {filter.dateFilter?.startDate +
                      " to " +
                      filter.dateFilter.endDate}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setFilter((prev) => ({
                      ...prev,
                      dateFilter: { endDate: "", startDate: "" },
                    }))
                  }
                  className=" "
                >
                  <X className="text-[var(--danger-text)] " size={20} />
                </button>
              </div>
            )}
            {filter?.normalFilter && (
              <div className="flex px-1 py-0.5 gap-2 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
                <div className="flex gap-1 items-center justify-center">
                  <span className="text-[15px] text-[var(--dark-secondary-text)]">
                    {filter.normalFilter?.toLocaleLowerCase().slice(0, 15)}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, normalFilter: "" }))
                  }
                  className=" "
                >
                  <X className="text-[var(--danger-text)] " size={20} />
                </button>
              </div>
            )}
          </div>
          <Button
            bodyStyle={{
              width: "400px",
              top: "3rem",
              left: "-18rem",
            }}
            types={[
              {
                label: "Previous week",
                value: "previous",
                id: "8933lfjsl840fhn",
              },
            ]}
            checkFn={{
              checkTypeFn: (isChecked: boolean) => {
                if (!isChecked) {
                  setFilter((prev) => ({ ...prev, normalFilter: "" }));
                }
                if (isChecked) {
                  setFilter((prev) => ({
                    ...prev,
                    normalFilter: dayjs().format("YYYY-MM-Dd"),
                  }));
                }
              },
              dateActionFn: (from, to) => {
                if (from && to) {
                  setFilter((prev) => ({
                    ...prev,
                    dateFilter: {
                      startDate: dayjs(from).format("YYYY-MM-DD"),
                      endDate: dayjs(to).format("YYYY-MM-DD"),
                    },
                  }));
                }
              },
            }}
            parent={
              <div className="flex border-[1px] border-[var(--dark-border)]  px-4 py-2 rounded items-center justify-start gap-2">
                <Filter
                  strokeWidth={2.5}
                  className="size-5 text-[var(--dark-secondary-text)]"
                />
                <p className="text-[16px] text-[var(--dark-secondary-text)] tracking-widest ">
                  Filter
                </p>
              </div>
            }
          />
        </div>
        <div className="flex items-center flex-wrap justify-between w-full gap-7 ">
          {!loading ? (
            totalOrder?.map((order, index) => (
              <CardAnalytics
                title={order?.title}
                total={order?.total}
                percentage={order?.percentage}
                subtitle={order?.subtitle}
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
