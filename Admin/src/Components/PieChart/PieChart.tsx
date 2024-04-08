import React, { useEffect } from "react";
import Chart from "chart.js/auto";

export const PieChartData = [
  {
    item: "Pizza",
    totalSell: "450",
    totalSellInPer: "40%",
  },
  {
    item: "Pizza",
    totalSell: "450",
    totalSellInPer: "40%",
  },
  {
    item: "Pizza",
    totalSell: "450",
    totalSellInPer: "40%",
  },
];

const PieChart: React.FC = () => {
  const ctx = document.getElementById("piechart")! as HTMLCanvasElement;
  useEffect(() => {
    const drawChart = async () => {
      if (ctx) {
        new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: PieChartData?.map((item) => item.item),
            datasets: [
              {
                label: "My First Database",
                data: PieChartData?.map((data) => data.item),
                backgroundColor: [
                  "rgb(255, 99, 132)",
                  "rgb(54, 162, 235)",
                  "rgb(255, 205, 86)",
                ],
              },
            ],
          },
        });
      }
    };
    drawChart();
  });

  return <canvas id="piechart">Hel</canvas>;
};

export default PieChart;
