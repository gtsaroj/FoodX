import { PieChart, PiePlot } from "@mui/x-charts/PieChart";
import { ResponsiveChartContainer } from "@mui/x-charts";
import React from "react";
import { orders } from "../DummyData";
import { quantityOfEachCategory, totalQuantityOfOrder } from "./PieData";

export const PieChartComponent: React.FC = () => {
  const date = new Date();
  const today = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const todaysOrder = orders.filter(
    (order) => order.orderFullFilled === today.toString()
  );

  const eachCategory = quantityOfEachCategory(todaysOrder);
  console.log(totalQuantityOfOrder(todaysOrder));

  const data = Object.keys(eachCategory).map((item, index) => {
    return {
      id: index,
      value: eachCategory[item],
      label: item,
    };
  });

  return (
    <React.Fragment>
      <div className="xl:w-[400px] w-full flex items-center justify-center rounded-lg bg-gray-500 px-4 py-4 overflow-hidden h-full">
        <ResponsiveChartContainer
          series={[
            {
              data: [
                { id: 1, value: 200, label: "pizza" },
                { id: 2, value: 300, label: "Momo" },
                { id: 3, value: 600, label: "Momo" },
              ],
              type: "pie",
            },
          ]}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 1,
            left: 0,
            right: 0,
          }}
          height={300}
        >
          <PiePlot />
        </ResponsiveChartContainer>
      </div>
    </React.Fragment>
  );
};
