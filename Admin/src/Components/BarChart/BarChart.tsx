/* eslint-disable no-empty */
import { BarChart } from "@mui/x-charts";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { barData, monthlyBarData } from "./BarChart";
import { chartData } from "../../data.json";
interface MonthlyOrderChartProps {
  height: number;
  dateRange: { startDate: Dayjs; endDate: Dayjs };
}

export const MonthlyOrderChart: React.FC<MonthlyOrderChartProps> = ({
  height,
  dateRange,
}) => {
  const [initialData, setInitialData] = useState<
    { [key: string]: number | string }[]
  >([]);
  const [dataKey1, setDataKey1] = useState<string[]>([]);
  const [dataKey2, setDataKey2] = useState<string[]>([]);
  const [dataKey3, setDataKey3] = useState<string[]>([]);
  const [dataKey4, setDataKey4] = useState<string[]>([]);
  const [dataKey5, setDataKey5] = useState<string[]>([]);

  useEffect(() => {
    const response = monthlyBarData(chartData);
    setInitialData(response);
    console.log(response);
    const object1 = Object.keys(response[0]).filter((key) => key !== "time");

    setDataKey1(object1);
    const object2 = Object.keys(response[1]).filter((key) => key !== "time");
    setDataKey2(object2);
    const object3 = Object.keys(response[2]).filter((key) => key !== "time");
    setDataKey3(object3);
    const object4 = Object.keys(response[3]).filter((key) => key !== "time");
    setDataKey4(object4);
    const object5 = Object.keys(response[4]).filter((key) => key !== "time");
    setDataKey5(object5);
    // const allkeys: string[] = extractUniqueKeys(response);
    // setDataKey(allkeys);
  }, []);
  console.log(dataKey1);

  // useEffect(() => {
  //   const filterByDate = async () => {
  //     // const startDate = dayjs(dateRange.startDate).format();
  //     // const endDate = dayjs(dateRange.endDate);
  //     const getOrder = await getAllOrder();
  //     const filteredData = await filterBarData(getOrder, {
  //       startDate: dateRange.startDate,
  //       endDate: dateRange.endDate,
  //     });
  //     setInitialData(filteredData);
  //     filteredData?.forEach((data) => {
  //       const keys = Object.keys(data).filter((key) => key !== "time");
  //       const ogDataKey = [...new Set(keys)];
  //       setDataKey(ogDataKey);
  //     });
  //   };

  //   if (
  //     dateRange.startDate &&
  //     dateRange.endDate &&
  //     dateRange.startDate !== dateRange.endDate
  //   ) {
  //     filterByDate();
  //   }
  // }, [dateRange.startDate, dateRange.endDate]);

  const extractUniqueKeys = (data: { [key: string]: number | string }[]) => {
    console.log(data);
    const allKeys = new Set();
    data.forEach((item) => {
      const labelKeys = Object.keys(item).filter((index) => index !== "time");
      labelKeys.forEach((key) => allKeys.add(key));
    });
    return [...allKeys];
  };
  // Function to check if a key is relevant (used in the dataset)
  const isKeyRelevant = (key: string): boolean => {
    return initialData.some((dataPoint) =>
      Object.keys(dataPoint).includes(key)
    );
  };

  const valueFormattor = (value: number) => (value ? value : "hello");

  // Update series creation logic to filter out unused keys
  // const series = dataKey.filter(isKeyRelevant).map((key) => ({
  //   dataKey: key,
  //   label: key,
  //   valueFormattor,
  // }));

  const colorPallette = ["#003f5c", "#7a5195", "#ef5675", "#ffa600"];
  return (
    <div className={`w-full p-2 h-[${height}px]`}>
      <BarChart
        grid={{ horizontal: true }}
        colors={colorPallette}
        skipAnimation
        slotProps={{
          // loadingOverlay: { message: "Loading Data....." },
          // noDataOverlay: { message: "No Data to display." },
          // legend: {
          //   hidden: true,
          //   itemMarkHeight: 10,
          //   labelStyle: { fontSize: "30px", alignItems: "center" },
          //   direction: "row",
          //   position: { vertical: "bottom", horizontal: "middle" },
          // },
          legend: {
            hidden: true,
            // labelStyle: {
            //   fontSize: "12px",
            // },
          },
        }}
        dataset={initialData}
        borderRadius={6}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "time",
            data: initialData?.map((data) => data["time"]),
          },
        ]}
        series={[
          {
            data: [1300, 1500, 1214, 2341, 234],
          },
          {
            data: [1340, 1475, 1220, 2320, 250],
          },
          {
            data: [1320, 1550, 1200, 2280, 260],
          },
          {
            data: [1360, 1480, 1240, 2370, 240],
          },
        ]}
      />
    </div>
  );
};
