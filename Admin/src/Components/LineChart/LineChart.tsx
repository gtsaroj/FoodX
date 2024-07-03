import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";
import { ArrowUp, Filter } from "lucide-react";
import "./LineChart.css";
import { DropDown } from "../Common/DropDown/DropDown";
import { getOrders } from "../../Services";
import {
  aggregateLineDataMonthly,
  aggregateLineDataWeekly,
} from "./LineChartData";
import { Order } from "../../models/order.model";

export const WeekReveneuChart: React.FC = () => {
  const [orderRevenue, setOrderRevenue] = useState<
    { [key: string]: string | number }[]
  >([]);

  useEffect(() => {
    getOrders().then((data) => {
      const revenueOfOrders = aggregateLineDataWeekly(data.data as Order[]);
      setOrderRevenue(revenueOfOrders);
    });
  }, []);

  // useEffect(() => {
  //   const dailyRevenue : string[] | number[] = []

  //   if (orderRevenue) {
  //     // const lastIndexOfOrder = orderRevenue.length -1
  //     orderRevenue?.forEach((order) => {
  //     dailyRevenue.push(order.revenue as never)
  //     })
  //   }
  //   // console.log(orderRevenue)
  //   // const currentDayRevenue : string | number = orderRevenue[orderRevenue.length - 1].revenue;
  //   // const weeklyRevenue = dailyRevenue.slice(-7);

  //   // const percentageChanges = weeklyRevenue.map((revenue) => {
  //   //   return ((currentDayRevenue - revenue) / revenue) * 100;
  //   // });

  // },[orderRevenue])

  return (
    <div className="w-full bg-[var(--light-background)] h-[250px] sm:h-[400px] pt-2 pb-16 sm:px-5 rounded">
      <h2 className="w-full p-2 text-left text-xl text-[var(--primary-color)] ">
        Weekly Revenue
      </h2>
      <div className="w-full flex p-2 items-center justify-between">
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
              <Filter />
              <span>Filter</span>
            </>
          }
          options={["Current Week", "1 week ago"]}
        />
        <h1 className="  font-bold text-[#45c241] text-[16px] flex items-start gap-1 justify-center ">
          <span>12.5%</span>
          <ArrowUp className="size-5" />
        </h1>
      </div>
      <LineChart
        slotProps={{
          legend: {
            direction: "row",
            labelStyle: { fontSize: "14px" },
            position: { vertical: "bottom", horizontal: "middle" },
          },
        }}
        xAxis={[
          {
            data: orderRevenue?.map((order) => order["week"] as number),
            scaleType: "point",
          },
        ]}
        series={[
          {
            data: orderRevenue?.map((order) => order["revenue"]),
            type: "line",
            color: "#45c241",
          },
        ]}
        skipAnimation={false}
      ></LineChart>
    </div>
  );
};

export const MonthlyRevenueChart: React.FC = () => {
  const [orderRevenue, setOrderRevenue] = useState<
    { [key: string]: string | number }[]
  >([]);

  const handleSelect = async (option: string) => {
    const allOrders = await getOrders();
    const filterRevenue = aggregateLineDataMonthly(allOrders.data, option);
    setOrderRevenue(filterRevenue);
  };

  useEffect(() => {
    getOrders().then((data) => {
      const revenueOfOrders = aggregateLineDataMonthly(
        data.data as Order[],
        "current month"
      );
      setOrderRevenue(revenueOfOrders);
    });
  }, []);

  console.log(orderRevenue);

  return (
    <div className="w-full  flex flex-col items-start justify-center px-4 py-5 h-[250px] sm:h-[400px] bg-[var(--light-background)] ">
      <h2 className="w-full text-left pb-4  text-xl text-[var(--primary-color)] ">
        Monthly Revenue
      </h2>
      <div className="w-full">
        <DropDown
          onSelect={handleSelect}
          options={["Current week", "Previous week"]}
        />
      </div>
      <LineChart
        xAxis={[
          {
            data: orderRevenue?.map((order) => order["week"] as number),
            scaleType: "point",
          },
        ]}
        series={[
          {
            data: orderRevenue?.map((order) => order["revenue"]),
          },
        ]}
      />
    </div>
  );
};
