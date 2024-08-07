/* eslint-disable no-empty */
import { BarChart } from "@mui/x-charts";
import { orderChartsOfMonthly } from "../LineChart/D";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { getAllOrder } from "../../Services";
import {
  barData,
  filterBarData,
  filterBarTodayData,
} from "../../Utility/DateUtils";
interface MonthlyOrderChartProps {
  height: number;
  dateRange: { startDate: Dayjs; endDate: Dayjs };
}
const foodData = [
  {
    samosa: 10,
    pizza: 5,
    burger: 8,
    pasta: 12,
    fries: 20,
    time: dayjs("2024-08-01T10:00:00Z").format("YYYY-MM-DD"),
  },
  {
    samosa: 15,
    pizza: 10,
    burger: 12,
    pasta: 10,
    fries: 25,
    time: dayjs("2024-08-02T10:00:00Z").format("YYYY-MM-DD"),
  },
  {
    samosa: 7,
    pizza: 9,
    burger: 5,
    pasta: 11,
    fries: 18,
    time: dayjs("2024-08-03T10:00:00Z").format("YYYY-MM-DD"),
  },
  {
    samosa: 20,
    pizza: 12,
    burger: 15,
    pasta: 10,
    fries: 30,
    time: dayjs("2024-08-04T10:00:00Z").format("YYYY-MM-DD"),
  },
  {
    samosa: 25,
    pizza: 14,
    burger: 18,
    pasta: 13,
    fries: 22,
    time: dayjs("2024-08-05T10:00:00Z").format("YYYY-MM-DD"),
  },
  {
    samosa: 10,
    pizza: 5,
    burger: 8,
    pasta: 12,
    fries: 20,
    time: dayjs("2024-08-06T10:00:00Z").format("YYYY-MM-DD"),
  },
];

export const MonthlyOrderChart: React.FC<MonthlyOrderChartProps> = ({
  height,
  dateRange,
}) => {
  const [initialData, setInitialData] = useState<{ [key: string]: string }[]>(
    []
  );
  const [dataKey, setDataKey] = useState<string[]>([]);
  const getAllOrders = async () => {
    try {
      const response = await getAllOrder();
      const filtersData = await filterBarTodayData(response);

      setInitialData(filtersData);
      filtersData?.forEach((data) => {
        const keys = Object.keys(data).filter((key) => key !== "time");
        const ogDataKey = [...new Set(keys)];
        setDataKey(ogDataKey);
      });
    } catch (error) {
      throw new Error("Unable to get orders in bar" + error);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  useEffect(() => {
    const filterByDate = async () => {
      // const startDate = dayjs(dateRange.startDate).format();
      // const endDate = dayjs(dateRange.endDate);
      const getOrder = await getAllOrder();
      const filteredData = await filterBarData(getOrder, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      setInitialData(filteredData);
      filteredData?.forEach((data) => {
        const keys = Object.keys(data).filter((key) => key !== "time");
        const ogDataKey = [...new Set(keys)];
        setDataKey(ogDataKey);
      });
    };

    if (
      dateRange.startDate &&
      dateRange.endDate &&
      dateRange.startDate !== dateRange.endDate
    ) {
      filterByDate();
    }
  }, [dateRange.startDate, dateRange.endDate]);

  const series =
    dataKey &&
    dataKey.map((key) => ({
      dataKey: key,
      label: key,
    }));

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
        series={series as { dataKey: string; label: string }[]}
      />
    </div>
  );
};
