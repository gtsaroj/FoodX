import { PieChart } from "@mui/x-charts/PieChart";

import React from "react";
import { orders } from "../DummyData";
import { quantityOfEachCategory, totalQuantityOfOrder } from "./PieData";

const PieChartComponent: React.FC = () => {
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
      <div className="w-[350px] bg-[var(--light-background)] h-full">
        <PieChart
          series={[
            {
              data,
            },
          ]}
          width={500}
          height={200}
        />
      </div>
    </React.Fragment>
  );
};

export default PieChartComponent;
