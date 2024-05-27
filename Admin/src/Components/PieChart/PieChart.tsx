import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { da } from "@faker-js/faker";

export const PieChartData = [
  {
    item: "Pizza",
    totalSell: 450,
  },
  {
    item: "Burger",
    totalSell: 1000,
  },
  {
    item: "Cold Drinks",
    totalSell: 800,
  },
];

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.defaults.font.size = 14;

const PieChart: React.FC = () => {
  const [dataInPercentage, setDataInPercentage] = useState<
    string[] | number[]
  >();

  useEffect(() => {
    const totalData = PieChartData.reduce(
      (acc, item) => (acc += item.totalSell),
      0
    );

    const data = PieChartData.map(
      (item) => Math.round((item.totalSell / totalData) * 100) + "%"
    );
    setDataInPercentage(data);
  }, []);

  const Data = {
    labels: PieChartData.map(
      (item, index) =>
        `${item.item} : ${dataInPercentage ? dataInPercentage[index] : ""}`
    ),
    datasets: [
      {
        label: "Total Sell",
        data: PieChartData?.map((item) => item.totalSell),
        backgroundColor: [
          "#00a3d9",
          "rgba(54, 162, 235, 0.2)",
          "#ec008e",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className=" w-[300px] bg-[var(--light-background)] py-2 px-7 rounded-lg ">
      <Doughnut
        data={Data}
        className="container h-full"
        options={{
          onHover: (event, chartElement) => {
            if (chartElement.length === 1) {
              event.native?.target
                ? (event.native.target.style.cursor = "pointer")
                : "";
            }
            if (chartElement.length === 0) {
              event.native?.target
                ? (event.native.target.style.cursor = "default")
                : "";
            }
          },
          font: {
            size: 10,
          },
          plugins: {
            legend: {
              display: true,
              align: "start",
              position: "bottom",
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
