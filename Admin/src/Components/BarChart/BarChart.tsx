import { BarChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import { orderChartsOfMonthly } from "../LineChart/D";
import { DropDown } from "../Common/DropDown/DropDown";
import { getOrders } from "../../Services";
import { aggregateBarData } from "../../Utility/DateUtils";
import { Order } from "../../models/order.model";

export const BarChartOfWeeklyOrder: React.FC = () => {
  const [weeklyBarData, setWeeklyBarData] = useState<
    { [key: string]: string }[]
  >([]);

  useEffect(() => {
    getOrders().then((data: any) => {
      const barData = aggregateBarData(data.data as Order[]);
      setWeeklyBarData(barData);
    });
  }, []);
  const productNames = Array.from(
    new Set(
      weeklyBarData.flatMap((data) =>
        Object.keys(data).filter((key) => key !== "week")
      )
    )
  );

  console.log(productNames);

  const valueFormatter = (value: number | null) => value;
  return (
    <div className="bg-[var(--light-background)] rounded py-2 w-full lg:w-[600px] h-[300px] sm:h-[400px] flex  flex-col items-start px-2 justify-center">
      <h2 className="text-xl p-2 text-[var(--primary-color)] ">
        Weekly Orders
      </h2>
      <BarChart
        slotProps={{
          legend: { hidden: true },
        }}
        xAxis={[{ scaleType: "band", disableLine: true, dataKey: "week" }]}
        dataset={weeklyBarData} // Ensure this is correctly formatted
        series={productNames?.map((product) => ({
          dataKey: product,
          label: product,
          valueFormatter: valueFormatter,
        }))}
        sx={{
          width: 100,
          strokeWidth: 1,
          cursor: "pointer",
        }}
      ></BarChart>
    </div>
  );
};

export const MonthlyOrderChart: React.FC = () => {
  const valueFormatter = (value: number | null) => value;
  return (
    <div className="w-full h-[300px] bg-[var(--light-background)] px-5 sm:h-[400px] py-5">
      <h2 className="w-full text-left text-xl pb-4 text-[var(--primary-color)] ">
        Monthly Revenue
      </h2>
      <DropDown options={["Current week", "Previous week"]} />
      <BarChart
        slotProps={{
          legend: {
            hidden: true,
            itemMarkHeight: 10,
            labelStyle: { fontSize: "10px", alignItems: "center" },
            direction: "row",
            position: { vertical: "bottom", horizontal: "middle" },
          },
        }}
        dataset={orderChartsOfMonthly}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "week",
          },
        ]}
        series={[
          {
            dataKey: "samosa",
            label: "Samosa",
            valueFormatter,
          },
          {
            dataKey: "pizza",
            label: "Pizza",
            valueFormatter,
          },
          {
            dataKey: "cold_drinks",
            label: "Cold Drinks",
            valueFormatter,
          },
          {
            dataKey: "others",
            label: "Others",
            valueFormatter,
          },
        ]}
      />
    </div>
  );
};
