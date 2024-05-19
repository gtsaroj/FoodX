import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { da, faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // 1. Register Filler plugin
);

export const LineChartOfOrder = () => {
  ChartJS.defaults.font.size = 10;
  ChartJS.defaults.aspectRatio = 2 / 1;
  const labels = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map(() => faker.datatype.number({ min: 0, max: 50 })),

        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderRadius: "10px",
        tension: 0.4,
        fill: {
          target: "origin",
          above: "#ec008ed7",
        },
      },
    ],
  };
  return (
    <React.Fragment>
      <div className="w-[500px] bg-[#8a849577] py-2 px-7 rounded-lg ">
        <Line
          data={data}
          options={{
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: "Weekly Order",
                align: "start",
                color: "Red",
                font: {
                  size: 20,
                  family: "Geneva",
                },
                padding: { bottom: 40 },
              },
              colors: {
                enabled: true,
              },
            },
          }}
          className="container h-full"
        />
      </div>
    </React.Fragment>
  );
};

export const LineChartOfRevenue = () => {
  const labels = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map(() => faker.datatype.number({ min: 0, max: 50 })),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderRadius: "10px",

        tension: 0.4,
        fill: {
          target: "origin",
          above: "#ec008ed7",
        },
      },
    ],
  };

  return (
    <React.Fragment>
      <div className=" mx-7  w-[930px] bg-[#8a849577] py-2 px-7 rounded-lg ">
        <Line
          data={data}
          options={{
            aspectRatio: 5 / 2,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: "Weekly Revenue",
                align: "start",
                color: "Red",
                font: {
                  size: 20,
                  family: "Geneva",
                },
                padding: { bottom: 40 },
              },
              colors: {
                enabled: true,
              },
            },
          }}
          className="w-full h-full"
        />
      </div>
    </React.Fragment>
  );
};

export const LineChartRevenueOfAnalytics = () => {
  const labelOfWeekly = [
    "Jan 01",
    "Jan 02",
    "Jan 03",
    "Jan 04",
    "Jan 05",
    "Jan 06",
    "Jan 07",
  ];

  const data = {
    labels: labelOfWeekly,
    datasets: [
      {
        label: "Current Week Revenue",
        data: labelOfWeekly.map(() =>
          faker.datatype.number({ min: 0, max: 50 })
        ),
        borderColor : "rgba(6,20,345)",
        backgroundColor: "#32a852",
        borderRadius: "10px",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointRadius: 6,
        pointHoverRadius: 7,

        tension: 0.4,
        fill: {
          target: "origin",
          above: "#32a85263",
        },
      },
      {
        label: "Previous Week Revenue",
        data: labelOfWeekly.map(() =>
          faker.datatype.number({ min: 0, max: 50 })
        ),
        pointBackgroundColor: "rgba(0,0,0)",
        borderColor : "rgba(0,0,0)",
        borderRadius: "10px",
        pointRadius: 6,
        pointHoverRadius: 7,

        tension: 0.4,
        fill: {
          target: "origin",
          above: "#ec008ed7",
        },
      },
    ],
  };
  return (
    <React.Fragment>
      <div className="w-[900px] rounded-md bg-[#8a849577] py-2 px-5">
        <Line
          className="w-full"
          data={data}
          options={{
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
            },
            font: {
              size: 14,
            },
            plugins: {
              title: {
                display: true,
                text: "Monthly Revenue",
                color: "Red",
                align: "center",
                padding: {
                  bottom: 40,
                },
                font: {
                  size: 20,
                },
              },
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>
    </React.Fragment>
  );
};

export const LineChartOfSellsOfAnalytics = () => {
  
const xlabel =   [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]
const data = {
  labels: xlabel,
  datasets: [
    {
      label: "Current Week Sells",
      data: xlabel.map(() =>
        faker.datatype.number({ min: 0, max: 50 })
      ),
      borderColor : "rgba(6,20,345)",
      backgroundColor: "#32a852",
      borderRadius: "10px",
      pointBackgroundColor: "rgb(255, 99, 132)",
      pointRadius: 6,
      pointHoverRadius: 7,

      tension: 0.4,
      fill: {
        target: "origin",
        above: "#32a85263",
      },
    },
    {
      label: "Previous Week Sells",
      data: xlabel.map(() =>
        faker.datatype.number({ min: 0, max: 50 })
      ),
      pointBackgroundColor: "rgba(0,0,0)",
      borderColor : "rgba(0,0,0)",
      borderRadius: "10px",
      pointRadius: 6,
      pointHoverRadius: 7,

      tension: 0.4,
      fill: {
        target: "origin",
        above: "#ec008ed7",
      },
    },
  ],
};
  return (
    <React.Fragment>
    <div className="w-[900px] rounded-md bg-[#8a849577] py-2 px-5">
        <Line className="w-full" data={data} 
          options={{
            plugins: {
              title: {
                display: true,
                text: "Monthly Sells",
                color: "Red",
                align: "center",
                padding: {
                  bottom: 40,
                },
                font: {
                  size: 20,
                },
              },
            }
          }}
         />
        
    </div>
    </React.Fragment>
  )
}
