import { LineChart } from "@mui/x-charts";
import { Filter, MoveUp, X } from "lucide-react";
import "./LineChart.css";
import { useEffect, useState } from "react";
import { Button } from "../Common/Button/Button";
import dayjs from "dayjs";
import {
  calculateTotalOrders,
  calculateTotalRevenue,
  monthlyRevenue,
  revenueData,
  totalMonthOrder,
} from "./LineChartData";
import { getRevenue } from "../../Services/revenue.services";
import { AddRevenue } from "../../models/revenue.model";
import { RotatingLines } from "react-loader-spinner";

export const WeekReveneuChart: React.FC = () => {
  const [initialData, setInitialData] = useState<
    { time: string; revenue: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [percentageChange, setPercentageChange] = useState<string>();

  const getLineChartData = async () => {
    setLoading(true);
    try {
      const response = await getRevenue({
        startDate: dayjs().startOf("week").format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
      });
      const totalData = revenueData(response.data);
      setInitialData(totalData);
    } catch (error) {
      setInitialData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getLineChartData();
  }, []);

  const calculatePercentageChange = async () => {
    setLoading(true);
    try {
      const response = await getRevenue({
        startDate: dayjs().subtract(1, "week").format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
      });
      const previousMonthData = revenueData(response?.data);
      const totalCurrent = calculateTotalRevenue(
        initialData as { time: string; revenue: number }[]
      );
      const totalPrevious = calculateTotalRevenue(previousMonthData);
      if (totalPrevious === 0) {
        setPercentageChange("N/A"); // Handle zero previous orders
      } else {
        const percentage =
          ((totalCurrent - totalPrevious) / totalPrevious) * 100;
        setPercentageChange(percentage.toFixed(2));
      }
    } catch (error) {
      setPercentageChange("N/A");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialData.length) {
      calculatePercentageChange();
    }
  }, [initialData.length]);

  return (
    <div className="flex  flex-col items-center justify-center w-full gap-5 px-3 py-5 rounded">
      <div className="flex items-center justify-between w-full gap-3 px-2">
        <div className="text-left text-xl text-[var(--dark-text)] flex justify-center items-center gap-3">
          <p className="text-nowrap">Weekly Revenue</p>
          <p
            className={`text-[16px]  tracking-wider  ${
              percentageChange?.includes("-") ||
              percentageChange?.includes("N/A")
                ? "text-red-600"
                : "text-[var(--green-text)]  "
            } flex justify-center items-center gap-0.5  rounded-lg`}
          >
            <span>{percentageChange}%</span>
            <span className="mb-[2px]">
              <MoveUp
                className={` ${
                  percentageChange === "N/A"
                    ? "invisible"
                    : percentageChange?.includes("-")
                    ? "rotate-180 "
                    : ""
                }`}
                strokeWidth={3}
                size={12}
              />
            </span>
          </p>
        </div>
      </div>
      <div className="h-[400px] lg:h-[300px] w-full">
        {loading ? (
          <div className="flex w-full h-full items-center justify-center gap-3">
            <RotatingLines strokeColor="var(--dark-text)" width="27" />
            <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
              {" "}
              loading...
            </span>
          </div>
        ) : initialData?.length > 0 ? (
          <LineChart
            sx={{
              "& .MuiLineElement-root": {
                strokeDasharray: "2 2",
                strokeWidth: 3,
              },
              "& .MuiAreaElement-series-Germany": {
                fill: "url('#myGradient')",
              },
              "& .MuiChartsHoverLine": {
                stroke: "var(--dark-text)", // Set the hover line color to white
                strokeWidth: 1, // Adjust the thickness as needed
              },
              "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
                stroke: "var(--dark-text)", // Blue color for the X-axis line
                strokeWidth: 0.8,
              },
              "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                stroke: "var(--dark-text)", // Blue color for the Y-axis line
                strokeWidth: 0.8,
              },
              "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                letterSpacing: "2px",
                fill: "var(--dark-text)", // Blue color for the X-axis labels
                strokeWidth: "0.5",
              },

              "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                fill: "var(--dark-text)", // Red color for the Y-axis labels
                strokeWidth: "0.4",
                letterSpacing: "2px",
              },
            }}
            slotProps={{
              legend: {
                direction: "row",
                labelStyle: { fontSize: "14px" },
                position: { vertical: "bottom", horizontal: "middle" },
              },
            }}
            xAxis={[
              {
                data: initialData?.map((order) => order["time"]),
                scaleType: "point",
              },
            ]}
            series={[
              {
                id: "revenue",
                data: initialData?.map((order) => order["revenue"]),
                type: "line",
                color: "#45c241",
              },
            ]}
            grid={{ vertical: true, horizontal: true }}
          ></LineChart>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

//monthly revenue
export const MonthlyRevenueChart: React.FC = () => {
  const [initialData, setInitialData] = useState<
    { time: string; revenue: number }[]
  >([]);
  const [previousData, setPreviousData] = useState<
    { time: string; revenue: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [percentageChange, setPercentageChange] = useState<string>();
  const [filter, setFilter] = useState<{
    dateFilter?: { startDate: string; endDate: string };
    normalFilter?: { previous: string; id?: string };
  }>();

  const syncData = () => {
    const times = new Set();
    const allKeys: string[] = [];

    [...initialData, ...previousData]?.forEach((time) => {
      times.add(time.time);
    });

    times?.forEach((time: any) => {
      allKeys.push(time);
    });

    return { allKeys };
  };

  const getLineChartData = async (data: AddRevenue) => {
    setLoading(true);
    try {
      const response = await getRevenue({
        startDate: data.startDate,
        endDate: data.endDate,
      });
      const totalData = monthlyRevenue(response.data);
      setInitialData(totalData);
    } catch (error) {
      throw new Error("Error while fetching revenue " + error);
    }
    setLoading(false);
  };

  const getPreviousChartData = async (data: AddRevenue) => {
    setLoading(true);
    try {
      const response = await getRevenue({
        startDate: data.startDate,
        endDate: data.endDate,
      });
      const totalData = monthlyRevenue(response.data);
      setPreviousData(totalData);
    } catch (error) {
      throw new Error("Error while fetching revenue " + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (filter?.normalFilter?.previous) {
      getPreviousChartData({
        startDate: dayjs()
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD"),
        endDate: dayjs()
          .subtract(1, "month")
          .endOf("month")
          .format("YYYY-MM-DD"),
      });
    } else {
      setPreviousData([]);
      getLineChartData({
        startDate:
          (filter?.dateFilter?.startDate as string) ||
          dayjs().startOf("month").format("YYYY-MM-DD"),
        endDate: filter?.dateFilter?.endDate || dayjs().format("YYYY-MM-DD"),
      });
    }
  }, [
    filter?.normalFilter?.previous,
    filter?.dateFilter?.startDate,
    filter?.dateFilter?.endDate,
  ]);

  const calculatePercentageChange = async () => {
    setLoading(true);
    try {
      const response = await getRevenue({
        startDate: dayjs()
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD"),
        endDate: dayjs()
          .subtract(1, "month")
          .endOf("month")
          .format("YYYY-MM-DD"),
      });
      const previousMonthData = monthlyRevenue(response.data);
      const totalCurrent = calculateTotalRevenue(initialData);
      const totalPrevious = calculateTotalRevenue(previousMonthData);
      if (totalPrevious === 0) {
        setPercentageChange("N/A"); // Handle zero previous orders
      } else {
        const percentage =
          ((totalCurrent - totalPrevious) / totalPrevious) * 100;
        setPercentageChange(percentage.toFixed(2));
      }
    } catch (error) {
      setPercentageChange("N/A");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialData?.length) {
      calculatePercentageChange();
    }
  }, [initialData?.length]);
  const { allKeys } = syncData();

  return (
    <div className="flex px-5 flex-col h-[430px] items-center justify-start w-full gap-1 p-3 rounded">
      <div className="flex  items-center   justify-between w-full gap-3 ">
        <div className="text-left text-xl  text-[var(--dark-text)] flex justify-center items-center gap-2">
          <p className="text-nowrap">Monthly Revenue</p>
          <p
            className={`text-[16px]  tracking-wider  ${
              percentageChange?.includes("-") ||
              percentageChange?.includes("N/A")
                ? "text-red-600"
                : "text-[var(--green-text)]  "
            } flex justify-center items-center gap-0.5  rounded-lg`}
          >
            <span>{percentageChange}%</span>
            <span className="mb-[2px]">
              <MoveUp
                className={` ${
                  percentageChange === "N/A"
                    ? "invisible"
                    : percentageChange?.includes("-")
                    ? "rotate-180 "
                    : ""
                }`}
                strokeWidth={3}
                size={12}
              />
            </span>
          </p>
        </div>
        <Button
          selectedTypes={[filter?.normalFilter?.id as string]}
          bodyStyle={{
            width: "400px",
            top: "3rem",
            left: "-18rem",
          }}
          types={[
            {
              label: "Previous week",
              value: "previous",
              id: "8933lffffffsdjsl840fhn",
            },
          ]}
          checkFn={{
            checkTypeFn: (isChecked: boolean, value: string, id: string) => {
              if (!isChecked) {
                setFilter((prev) => ({
                  ...prev,
                  normalFilter: { previous: "", id: "" },
                }));
              }
              if (isChecked) {
                setFilter((prev) => ({
                  ...prev,
                  normalFilter: { previous: value, id: id },
                }));
              }
            },
            dateActionFn: (from, to) => {
              if (from && to) {
                setFilter((prev) => ({
                  ...prev,
                  dateFilter: {
                    startDate: dayjs(from).format("YYYY-MM-DD"),
                    endDate: dayjs(to).format("YYYY-MM-DD"),
                  },
                }));
              }
            },
          }}
          parent={
            <div className="flex border-[1px] border-[var(--dark-border)]  px-4 py-2 rounded items-center justify-start gap-2">
              <Filter
                strokeWidth={2.5}
                className="size-5 text-[var(--dark-secondary-text)]"
              />
              <p className="text-[16px] text-[var(--dark-secondary-text)] tracking-widest ">
                Filter
              </p>
            </div>
          }
        />
      </div>
      <div className="flex  pt-1 h-[10px]  w-full  items-center justify-start gap-2">
        {filter?.dateFilter?.startDate && filter.dateFilter.endDate && (
          <div className="flex px-1 overflow-hidden py-0.5 gap-2 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1  w-full items-center justify-center">
              <span className="text-[15px] w-[180px]   text-[var(--dark-secondary-text)]">
                {filter.dateFilter?.startDate +
                  " to " +
                  filter.dateFilter.endDate}
              </span>
            </div>
            <button
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  dateFilter: { endDate: "", startDate: "" },
                }))
              }
              className=" "
            >
              <X className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
        {filter?.normalFilter?.previous && (
          <div className="flex px-1 py-0.5 gap-2 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] text-[var(--dark-secondary-text)]">
                {filter.normalFilter?.previous.toLocaleLowerCase().slice(0, 15)}
              </span>
            </div>
            <button
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  normalFilter: { previous: "", id: "" },
                }))
              }
              className=" "
            >
              <X className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
      </div>
      <div className="h-[400px] lg:h-[335px] w-full">
        {loading ? (
          <div className="flex w-full h-full items-center justify-center gap-3">
            <RotatingLines strokeColor="var(--dark-text)" width="27" />
            <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
              {" "}
              loading...
            </span>
          </div>
        ) : (
          <LineChart
            sx={{
              "& .MuiLineElement-root": {
                strokeDasharray: "2 2",
                strokeWidth: 3,
              },
              "& .MuiAreaElement-series-Germany": {
                fill: "url('#myGradient')",
              },
              "& .MuiChartsHoverLine": {
                stroke: "var(--dark-text)", // Set the hover line color to white
                strokeWidth: 1, // Adjust the thickness as needed
              },
              "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
                stroke: "var(--dark-text)", // Blue color for the X-axis line
                strokeWidth: 0.8,
              },
              "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                stroke: "var(--dark-text)", // Blue color for the Y-axis line
                strokeWidth: 0.8,
              },
              "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                letterSpacing: "2px",
                fill: "var(--dark-text)", // Blue color for the X-axis labels
                strokeWidth: "0.5",
              },

              "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                fill: "var(--dark-text)", // Red color for the Y-axis labels
                strokeWidth: "0.4",
                letterSpacing: "2px",
              },
            }}
            slotProps={{
              legend: {
                direction: "row",
                labelStyle: { fontSize: "14px" },
                position: { vertical: "bottom", horizontal: "middle" },
              },
            }}
            xAxis={[
              {
                data: allKeys?.map((data) => data),
                scaleType: "point",
              },
            ]}
            series={[
              {
                data: initialData?.map((order) => order["revenue"]),
                type: "line",
                color: "#45c241",
              },
              previousData && {
                data: previousData?.map((order) => order["revenue"]),
                type: "line",
                color: previousData?.length > 0 ? "red" : "transparent",
              },
            ]}
            grid={{ vertical: true, horizontal: true }}
          ></LineChart>
        )}
      </div>
    </div>
  );
};

//monthly order
export const MonthlyOrderLinechart: React.FC = () => {
  const [initialData, setInitialData] = useState<
    { time: string; orders: number }[]
  >([]);
  const [filter, setIsFilter] = useState<{
    dateFilter?: { startDate: string; endDate: string };
    normalFilter?: { previous: string; id: string };
  }>();
  const [previousData, setPreviousData] = useState<
    {
      time: string;
      orders: number;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [percentageChange, setPercentageChange] = useState<string>();

  const getOrders = async ({ startDate, endDate }: AddRevenue) => {
    setLoading(true);
    try {
      const response = await getRevenue({
        startDate: startDate,
        endDate: endDate,
      });

      const aggregateOrders = totalMonthOrder(response.data);
      setInitialData(aggregateOrders);
    } catch (error) {
      throw new Error("Error while fetching orders" + error);
    }
    setLoading(false);
  };

  const getPreviousOrders = async ({ startDate, endDate }: AddRevenue) => {
    setLoading(true);

    try {
      const response = await getRevenue({
        startDate: startDate,
        endDate: endDate,
      });
      const aggregateOrders = totalMonthOrder(response.data);
      setPreviousData(aggregateOrders);
    } catch (error) {
      throw new Error("Error while fetching orders" + error);
    }
    setLoading(false);
  };

  const syncData = () => {
    const times = new Set();
    const allKeys: string[] = [];
    [...initialData, ...previousData]?.forEach((data) => {
      times.add(data.time);
    });

    times?.forEach((time: any) => {
      allKeys.push(time);
    });
    return { allKeys };
  };

  useEffect(() => {
    if (filter?.normalFilter?.previous) {
      getPreviousOrders({
        startDate: dayjs()
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD"),
        endDate: dayjs()
          .subtract(1, "month")
          .endOf("month")
          .format("YYYY-MM-DD"),
      });
    } else {
      setPreviousData([]);
      getOrders({
        startDate:
          filter?.dateFilter?.startDate ||
          dayjs().startOf("month").format("YYYY-MM-DD"),
        endDate: filter?.dateFilter?.endDate || dayjs().format("YYYY-MM-DD"),
      });
    }
  }, [
    filter?.dateFilter?.startDate,
    filter?.dateFilter?.endDate,
    filter?.normalFilter?.previous,
  ]);

  const calculatePercentageChange = async () => {
    try {
      const response = await getRevenue({
        startDate: dayjs()
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD"),
        endDate: dayjs()
          .subtract(1, "month")
          .endOf("month")
          .format("YYYY-MM-DD"),
      });
      const previousMonthData = totalMonthOrder(response.data);
      const totalCurrent = calculateTotalOrders(initialData);
      const totalPrevious = calculateTotalOrders(previousMonthData);
      if (totalPrevious === 0) {
        setPercentageChange("N/A"); // Handle zero previous orders
      } else {
        const percentage =
          ((totalCurrent - totalPrevious) / totalPrevious) * 100;
        setPercentageChange(percentage.toFixed(2));
      }
    } catch (error) {
      setPercentageChange("N/A");
    }
  };

  useEffect(() => {
    if (initialData?.length) {
      calculatePercentageChange();
    }
  }, [initialData.length]);

  const { allKeys } = syncData();

  return (
    <div className="flex flex-col p-2 items-center justify-center w-full rounded">
      <div className="flex items-center justify-between w-full gap-3 ">
        <div className="  text-left text-xl text-[var(--dark-text)] flex justify-center items-center gap-2">
          <p className="text-nowrap">Monthly Order</p>
          <p
            className={`text-[16px]  tracking-wider  ${
              percentageChange?.includes("-") ||
              percentageChange?.includes("N/A")
                ? "text-red-600"
                : "text-[var(--green-text)]  "
            } flex justify-center items-center gap-0.5  rounded-lg`}
          >
            <span>{percentageChange}%</span>
            <span className="mb-[2px]">
              <MoveUp
                className={` ${
                  percentageChange === "N/A"
                    ? "invisible"
                    : percentageChange?.includes("-")
                    ? "rotate-180 "
                    : ""
                }`}
                strokeWidth={3}
                size={12}
              />
            </span>
          </p>
        </div>
        <Button
          selectedTypes={[filter?.normalFilter?.id as string]}
          bodyStyle={{
            width: "400px",
            top: "3rem",
            left: "-18rem",
          }}
          types={[{ label: "Previous", value: "previous", id: "8933840fhn" }]}
          checkFn={{
            checkTypeFn: (isChecked: boolean, value: string, id) => {
              if (!isChecked) {
                setIsFilter((prev) => ({
                  ...prev,
                  normalFilter: { id: "", previous: "" },
                }));
              }
              if (isChecked) {
                setIsFilter((prev) => ({
                  ...prev,
                  normalFilter: { id: id, previous: value },
                }));
              }
            },
            dateActionFn: (firstDate, secondDate) => {
              if (firstDate && secondDate) {
                setIsFilter((prev) => ({
                  ...prev,
                  dateFilter: {
                    startDate: dayjs(firstDate).format("YYYY-MM-DD"),
                    endDate: dayjs(secondDate).format("YYYY-MM-DD"),
                  },
                }));
              }
            },
          }}
          parent={
            <div className="flex border-[1px] border-[var(--dark-border)]  px-4 py-2 rounded items-center justify-start gap-2">
              <Filter
                strokeWidth={2.5}
                className="size-5 text-[var(--dark-secondary-text)]"
              />
              <p className="text-[16px] text-[var(--dark-secondary-text)] tracking-widest ">
                Filter
              </p>
            </div>
          }
        />
      </div>
      <div className="flex pt-1 h-[20px]  w-full   items-center justify-start gap-2">
        {filter?.dateFilter?.startDate && filter.dateFilter.endDate && (
          <div className="flex px-1 overflow-hidden py-0.5 gap-2 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] w-[180px] text-[var(--dark-secondary-text)]">
                {filter.dateFilter?.startDate +
                  " to " +
                  filter.dateFilter.endDate}
              </span>
            </div>
            <button
              onClick={() =>
                setIsFilter((prev) => ({
                  ...prev,
                  dateFilter: { endDate: "", startDate: "" },
                }))
              }
              className=" "
            >
              <X className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
        {filter?.normalFilter?.previous && (
          <div className="flex px-1 py-0.5 gap-2 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] text-[var(--dark-secondary-text)]">
                {filter.normalFilter?.previous.charAt(0).toUpperCase() + filter.normalFilter.previous.slice(1) }
              </span>
            </div>
            <button
              onClick={() =>
                setIsFilter((prev) => ({
                  ...prev,
                  normalFilter: { id: "", previous: "" },
                }))
              }
              className=" "
            >
              <X className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
      </div>
      <div className="h-[398px]  lg:h-[398px] w-full">
        {loading ? (
          <div className="flex w-full h-full items-center justify-center gap-3">
            <RotatingLines strokeColor="var(--dark-text)" width="27" />
            <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
              {" "}
              loading...
            </span>
          </div>
        ) : (
          <LineChart
            sx={{
              "& .MuiLineElement-root": {
                strokeDasharray: "2 2",
                strokeWidth: 3,
              },
              "& .MuiAreaElement-series-Germany": {
                fill: "url('#myGradient')",
              },
              "& .MuiChartsHoverLine": {
                stroke: "var(--dark-text)", // Set the hover line color to white
                strokeWidth: 1, // Adjust the thickness as needed
              },
              "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
                stroke: "var(--dark-text)", // Blue color for the X-axis line
                strokeWidth: 0.8,
              },
              "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                stroke: "var(--dark-text)", // Blue color for the Y-axis line
                strokeWidth: 0.8,
              },
              "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                letterSpacing: "2px",
                fill: "var(--dark-text)", // Blue color for the X-axis labels
                strokeWidth: "0.5",
              },

              "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                fill: "var(--dark-text)", // Red color for the Y-axis labels
                strokeWidth: "0.4",
                letterSpacing: "2px",
              },
            }}
            slotProps={{
              legend: {
                hidden: true,
                direction: "row",
                labelStyle: { fontSize: "14px" },
                position: { vertical: "bottom", horizontal: "middle" },
              },
            }}
            xAxis={[
              {
                labelStyle: { color: "white" },
                data: allKeys?.map((data) => data),
                scaleType: "point",
              },
            ]}
            series={[
              {
                id: "revenue",
                data: initialData?.map((order) => order["orders"] || null),
                type: "line",
                color: "#45c241",
                highlightScope: { fade: "global", highlight: "item" },
              },
              previousData && {
                data: previousData?.map((order) => order["orders"]),
                color: previousData?.length > 0 ? "red" : "transparent",
              },
            ]}
            grid={{ vertical: true, horizontal: true }}
          ></LineChart>
        )}
      </div>
    </div>
  );
};
