import { PieChart } from "@mui/x-charts";
import { aggregateDailyCategoryOrder } from "./PieData";
import {
  DailyCategoryAgrregateData,
} from "../../models/order.model";
import { useEffect, useState } from "react";
import { getOrders } from "../../Services";
import data from "../../data.json"

export default function ResponsiveChartExample() {
  const [categoryOrder, setCategoryOrder] = useState<
    DailyCategoryAgrregateData[]
  >([]);

  useEffect(() => {
    getOrders()
      .then((data: any) => {
        console.log(data.data);
        const orders = data?.data;
        const aggregateData = aggregateDailyCategoryOrder(
          orders,

        );
        setCategoryOrder(aggregateData);
      })
      .catch((err) => {
        throw new Error("Unable to categorized" + err);
      });
  }, []);

  return (
    <div className="lg:w-[400px] flex flex-col py-2  items-start px-2 justify-center w-full h-[300px] sm:h-[400px] rounded bg-[var(--light-background)]  ">
      <h2 className="text-xl p-2 text-[var(--primary-color)] ">Daily Orders</h2>
      <PieChart
        sx={{ cursor: "pointer" }}
        series={[
          {
            data: categoryOrder?.map((order, index) => ({
              id: index + 1,
              label: order.label,
              value: order.value as number,
            })),
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 3,
            cornerRadius: 5,
          },
        ]}
        slotProps={{
          legend: {
            labelStyle: { fontSize: "12px" },
            itemMarkHeight: 10,
            itemMarkWidth: 10,
            direction: "row",
            position: { vertical: "bottom", horizontal: "middle" },
          },
        }}
        // skipAnimation
      ></PieChart>
    </div>
  );
}

export const PieChartAnalytics = () => {
  const {categoryData} = data
  
  // const [categoryData, setCategoryData] = useState<
  //   (DailyCategoryAgrregateData & PieValueType)[]
  // >([]);

  // async function handleSelect(option: string) {
  //   const totalOrders = await getOrders();
  //   const getFilterOrders = aggregateDailyCategoryOrder(
  //     totalOrders.data,
  //     option.toLowerCase()
  //   );
  //   setCategoryData(getFilterOrders);
  // }

  // useEffect(() => {
  //   getOrders().then((data) => {
  //     const totalOrders = data.data;
  //     const getFilterOrders = aggregateDailyCategoryOrder(
  //       totalOrders,
  //       "current week"
  //     );
  //     if (getFilterOrders) setCategoryData(getFilterOrders);
  //   });
  // }, []);
  
  console.log(categoryData);
  
 
  return (
    <div className="w-full h-[430px] rounded-lg ">
      {/* 
      <DropDown
        options={["Current week", "Previous week"]}
        onSelect={handleSelect}
      /> 
      */}
      <PieChart
        sx={{ cursor: "pointer" }}
        series={[
          {
            data: categoryData?.map((order, index) => ({
              id: index + 1,
              label: order.categoryname,
              value: order.products,
            })),
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 3,
            cornerRadius: 5,
          },
        ]}
        slotProps={{
          legend: {
            hidden: true,
            // labelStyle: { fontSize: "12px" },
            // itemMarkHeight: 10,
            // itemMarkWidth: 10,
            // direction: "row",
            // position: { vertical: "bottom", horizontal: "right" },
          },
        }}
        skipAnimation
      />
    </div>
  );
};
