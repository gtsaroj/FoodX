import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

export const PieChartData = [
  {
    item: "Pizza",
    totalSell: "450",
    totalSellInPer: "40%",
  },
  {
    item: "Burger",
    totalSell: "450",
    totalSellInPer: "40%",
  },
  {
    item: "Cold Drinks",
    totalSell: "450",
    totalSellInPer: "40%",
  },
];
ChartJS.register(ArcElement, Tooltip, Legend);
export const Data = {
  labels: PieChartData?.map((data) => [data.item]),
  data: PieChartData?.map((data) => [data.totalSellInPer]),
  datasets: [
    {
      label: "Total Sell Per Day",
      data: PieChartData?.map((data) => [data.totalSell]),
      backgroundColor: [
        "#00a3d9",
        "rgba(54, 162, 235, 0.2)",
        "#ec008e",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};
const PieChart: React.FC = () => {
  return (
    <div className=" w-[400px] h-[300px]">
      <Doughnut data={Data} />
    </div>
  );
};

export default PieChart;
