/* eslint-disable no-empty */
import { BarChart } from "@mui/x-charts";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { barData, monthlyBarData } from "./BarChart";
import { Button } from "../Common/Button/Button";
import { Filter, MoveUp, X } from "lucide-react";
import { AddRevenue } from "../../models/revenue.model";
import { getRevenue } from "../../Services/revenue.services";
import { RotatingLines } from "react-loader-spinner";


export const MonthlyOrderChart: React.FC= () => {
  const [initialData, setInitialData] = useState<
    { [key: string]: number | string }[]
  >([]);
  const [dataKey, setDataKey] = useState<string[]>([]);
  const [filter, setFilter] = useState<{
    dateFilter?: { startDate: string; endDate: string };
    normalFilter?: string;
  }>();
  const [loading, setLoading] = useState<boolean>(false);

  const getBarData = async ({ startDate, endDate }: AddRevenue) => {
    setLoading(true);
    try {
      const response = await getRevenue({
        startDate: startDate,
        endDate: endDate,
      });
      const aggregateData = monthlyBarData(response.data);
      setInitialData(aggregateData);
      const listOfKeys = extractUniqueKeys(aggregateData);
      setDataKey(listOfKeys as string[]);
    } catch (error) {
      throw new Error("Error while fetching revenue" + error);
    }
    setLoading(false);
  };

  const getPreviousBarData = async ({ startDate, endDate }: AddRevenue) => {
    setLoading(true);
    try {
      const response = await getRevenue({
        startDate: startDate,
        endDate: endDate,
      });
      const aggregateData = monthlyBarData(response.data);
      setInitialData(aggregateData);
      const listOfKeys = extractUniqueKeys(aggregateData);
      setDataKey(listOfKeys as string[]);
    } catch (error) {
      throw new Error("Error while fetching revenue" + error);
    }
    setLoading(false);
  };


  useEffect(() => {
    if (filter?.normalFilter) {
      getPreviousBarData({
        startDate: dayjs()
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD"),
        endDate: dayjs()
          .subtract(1, "month")
          .endOf("month")
          .format("YYYY-MM-DD"),
      });
    }
    else {
      getBarData({
        startDate:
          (filter?.dateFilter?.startDate as string) ||
          dayjs().startOf("month").format("YYYY-MM-DD"),
        endDate: filter?.dateFilter?.endDate || dayjs().format("YYYY-MM-DD"),
      });
    }
  }, [filter?.normalFilter, filter?.dateFilter?.startDate, filter?.dateFilter?.endDate]);

  const extractUniqueKeys = (data: { [key: string]: number | string }[]) => {
    const allKeys = new Set();
    data.forEach((item) => {
      const labelKeys = Object.keys(item).filter((index) => index !== "time");
      labelKeys.forEach((key) => allKeys.add(key));
    });
    return [...allKeys];
  };

  const colorPallette = ["#003f5c", "#7a5195", "#ef5675", "#ffa600"];
  return (
    <div className={`w-full p-2 h-[450px]`}>
      <p className="w-full py-2  text-xl text-[var(--dark-text)] tracking-wider gap-2 flex items-center justify-between">
        <div className="flex items-center justify-start gap-2">
          <span>Top Products</span>
          <p className="text-[16px] tracking-wider  text-[var(--green-text)]  flex justify-center items-center gap-0.5  rounded-lg">
            <span>10%</span>
            <span className="mb-[2px]">
              <MoveUp strokeWidth={3} size={12} />
            </span>
          </p>
        </div>
        <div>
          <Button
            bodyStyle={{
              width: "400px",
              top: "3rem",
              left: "-18rem",
            }}
            parent={
              <div className="flex border-[1px] border-[var(--dark-border)]  px-4 py-1.5 rounded items-center justify-start gap-2">
                <Filter
                  strokeWidth={2.5}
                  className="size-5 text-[var(--dark-secondary-text)]"
                />
                <p className="text-[16px] text-[var(--dark-secondary-text)] tracking-widest ">
                  Filter
                </p>
              </div>
            }
            checkFn={{
              checkActionFn: (isChecked: boolean, value: string) => {
                if (!isChecked) {
                  setFilter((prev) => ({ ...prev, normalFilter: "" }));
                }
                if (isChecked) {
                  setFilter((prev) => ({ ...prev, normalFilter: value }));
                }
              },
              dateActionFn: (firstDate, secondDate) => {
                if (firstDate && secondDate) {
                  setFilter((prev) => ({
                    ...prev,
                    dateFilter: {
                      endDate: dayjs(secondDate).format("YYYY-MM-DD"),
                      startDate: dayjs(firstDate).format("YYYY-MM-DD"),
                    },
                  }));
                }
              },
            }}
            action={[
              { label: "Previous", value: "previous", id: "27909q3ur98fu" },
            ]}
          />
        </div>
      </p>
      <div className="flex h-[20px] pt-1 items-center justify-start gap-2">
        {filter?.dateFilter?.startDate && filter.dateFilter.endDate && (
          <div className="flex px-1 py-0.5 gap-1 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] w-[180px] text-[var(--dark-secondary-text)]">
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
        {filter?.normalFilter && (
          <div className="flex px-1 py-0.5 gap-1 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] text-[var(--dark-secondary-text)]">
                {filter.normalFilter?.toLocaleLowerCase().slice(0, 15)}
              </span>
            </div>
            <button
              onClick={() =>
                setFilter((prev) => ({ ...prev, normalFilter: "" }))
              }
              className=" "
            >
              <X className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
      </div>
      <div className="w-full h-[400px]">
        {loading ? (
          <div className="flex w-full h-full items-center justify-center gap-3">
            <RotatingLines strokeColor="var(--dark-text)" width="27" />
            <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
              {" "}
              loading...
            </span>
          </div>
        ) : (
          <BarChart
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
            grid={{ horizontal: true }}
            colors={colorPallette}
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
            series={dataKey?.map((key) => ({
              dataKey: key,
              label: key,
            }))}
          />
        )}
      </div>
    </div>
  );
};
