import React, { useEffect, useRef } from "react";
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
  ChartTypeRegistry,
  elements,
} from "chart.js";
import { faker } from "@faker-js/faker";

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

  const SellRef = useRef<ChartJS<keyof ChartTypeRegistry> | null>(null);

  useEffect(() => {
    const chart = SellRef.current;

    if (!chart) {
      return console.log("Chat Not Found");
    }
    const ctx = chart.ctx;
    const dataset = chart.data.datasets[0].data;

    const generateColors = dataset?.map((value, index, array) => {
      if (index === 0) return "rgba(0,0,0,0)"; // No gradient for initial value

      const prevValue = array[index - 1];
      if (prevValue && value) {
        return prevValue < value
          ? "rgba(0, 255, 0, 0.5)"
          : "rgba(255, 0, 0, 0.5)";
      }
    });

    const createGradientColor = (startColor: string, endColor: string) => {
      const gradientColor = ctx.createLinearGradient(0, 44, 0, 400);
      gradientColor?.addColorStop(0, startColor);
      gradientColor?.addColorStop(1, endColor);
      return gradientColor;
    };

    const backgroundColors = generateColors.map((color) => {
      return createGradientColor(color as string, color as string);
    });
    backgroundColors.map((color) => console.log(color));
    chart.data.datasets[0].backgroundColor = backgroundColors;
    chart.update();
  });

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
        label: "Total Order",
        data: labels.map(() => faker.datatype.number({ min: 0, max: 50 })),
        borderColor: "rgb(255, 99, 132)",
        pointRadius: 6,
        pointHoverRadius: 7,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };
  return (
    <React.Fragment>
      <div className="w-[550px] bg-[var(--light-background)] py-2 px-7 rounded-lg ">
        <Line
          ref={SellRef}
          data={data}
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
            scales: {
              y: {
                grid: { display: false },
              },
            },
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
  const RevenueRef = useRef<ChartJS<keyof ChartTypeRegistry> | null>(null);
  useEffect(() => {
    const chart = RevenueRef.current;
    if (chart) {
      const ctx = chart?.ctx;
      const gradient = ctx?.createLinearGradient(3, 30, 0, 400);
      gradient?.addColorStop(0, "#2c398d94");
      gradient?.addColorStop(1, "#00a3d993");
      ChartJS.defaults.backgroundColor = gradient;
    }
    if (chart) {
      const ctx = chart.ctx;
      const gradient2 = ctx.createLinearGradient(4, 5, 6, 400);
      gradient2.addColorStop(0, "#2c398d"),
        gradient2.addColorStop(1, "#00a3d9");
      ChartJS.defaults.borderColor = gradient2;
    }
  }, []);

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
        borderRadius: "10px",
        pointRadius: 7,
        pointHoverRadius: 8,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,

        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <React.Fragment>
      <div className="  w-[930px] bg-[var(--light-background)] py-2 px-7 rounded-lg ">
        <Line
          ref={RevenueRef as any}
          id="myChart"
          data={data}
          options={{
            onHover: (event, chartElement) => {
              if (chartElement.length === 1) {
                if (event.native?.target) {
                  event.native.target.style.cursor = "pointer";
                }
              }
              if (chartElement.length === 0) {
                if (event.native?.target) {
                  event.native.target.style.cursor = "default";
                }
              }
            },

            scales: {
              x: {
                grid: {
                  display: true,
                },
              },
              y: {
                grid: {
                  display: false,
                },
              },
            },
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

  const reveneuChart = useRef<ChartJS<keyof ChartTypeRegistry> | null>(null);

  useEffect(() => {
    const chart = reveneuChart.current;
    if (!chart) throw new Error("Reference of chart not defined");

    const datasetOfCurrentWeek = chart.data.datasets[0].data;
    const datasetOfPrevWeek = chart.data.datasets[1].data;

    const colorGenerateOfCurrentWeek = datasetOfCurrentWeek.map(
      (item, index, array) => {
        if (index === 0) return "#138a2d";

        const prevValue = array[index - 1];
        if (item && prevValue) {
          return prevValue < item ? "#138a2d" : "#992d1a";
        }
      }
    );
    const colorGenerateOfPrevWeek = datasetOfPrevWeek.map(
      (item, index, array) => {
        if (index === 0) return "#138a2d";

        const prevValue = array[index - 1];
        if (item && prevValue) {
          return prevValue < item ? "#138a2d" : "#992d1a";
        }
      }
    );
    const generateGradientColor = (startColor: string, endColor: string) => {
      const ctx = chart.ctx;
      if (!ctx) throw new Error("Chat not found");
      const gradient = ctx.createLinearGradient(3, 30, 0, 400);
      gradient.addColorStop(0, startColor);
      gradient.addColorStop(1, endColor);
      return gradient;
    };

    const backgroundColorOfCurrentWeek = colorGenerateOfCurrentWeek.map((item) => {
      return   generateGradientColor(item as string, item as string);
    })
    const backgroundColorOfPreviousWeek = colorGenerateOfPrevWeek.map((item) => {
      return  generateGradientColor(item as string, item as string)
    })
  
    
    chart.data.datasets[0].backgroundColor = backgroundColorOfCurrentWeek;
    chart.data.datasets[1].backgroundColor = backgroundColorOfPreviousWeek;
    chart.update()

  }, []);

  const data = {
    labels: labelOfWeekly,
    datasets: [
      {
        label: "Current Week Revenue",
        data: labelOfWeekly.map(() =>
          faker.datatype.number({ min: 0, max: 50 })
        ),
        borderColor: "rgba(6,20,345)",
        backgroundColor: "#32a852",
        borderRadius: "10px",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointRadius: 6,
        pointHoverRadius: 7,
        tension: 0.4,
        fill : true,
      },
      {
        label: "Previous Week Revenue",
        data: labelOfWeekly.map(() =>
          faker.datatype.number({ min: 0, max: 50 })
        ),
        pointBackgroundColor: "rgba(0,0,0)",
        borderColor: "rgba(0,0,0)",
        borderRadius: "10px",
        pointRadius: 6,
        pointHoverRadius: 7,
        tension: 0.4,
        fill : true,
      },
    ],
  };
  return (
    <React.Fragment>
      <div className="w-[900px] rounded-md bg-[var(--light-background)] py-2 px-5">
        <Line
          ref={reveneuChart}
          className="w-full"
          data={data}
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
  const xlabel = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const data = {
    labels: xlabel,
    datasets: [
      {
        label: "Current Week Sells",
        data: xlabel.map(() => faker.datatype.number({ min: 0, max: 50 })),
        borderColor: "rgba(6,20,345)",
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
        data: xlabel.map(() => faker.datatype.number({ min: 0, max: 50 })),
        pointBackgroundColor: "rgba(0,0,0)",
        borderColor: "rgba(0,0,0)",
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
      <div className="w-[900px] rounded-md bg-[var(--light-background)] py-2 px-5">
        <Line
          className="w-full"
          data={data}
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
            },
          }}
        />
      </div>
    </React.Fragment>
  );
};
