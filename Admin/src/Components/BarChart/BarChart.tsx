/* eslint-disable no-empty */
import { BarChart } from "@mui/x-charts";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { barData, monthlyBarData } from "./BarChart";
import { currentWeekData, previousWeekData } from "../../data.json";
import { Button } from "../Common/Button/Button";
import { Filter, MoveUp, X } from "lucide-react";
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
  console.log(initialData);
  const [dataKey, setDataKey] = useState<string[]>([]);
  const [filter, setFilter] = useState<{
    dateFilter?: string;
    normalFilter?: string;
  }>();

  useEffect(() => {
    // const response = monthlyBarData(chartData);
    // setInitialData(response);
    // console.log(response);

    // setDataKey(object1);
    setInitialData(currentWeekData);
    const allkeys: string[] = extractUniqueKeys(currentWeekData);
    setDataKey(allkeys);
  }, []);

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
    const allKeys = new Set();
    data.forEach((item) => {
      const labelKeys = Object.keys(item).filter((index) => index !== "date");
      labelKeys.forEach((key) => allKeys.add(key));
    });
    return [...allKeys];
  };

  // Update series creation logic to filter out unused keys
  // const series = dataKey.filter(isKeyRelevant).map((key) => ({
  //   dataKey: key,
  //   label: key,
  //   valueFormattor,
  // }));

  useEffect(() => {
    if (filter?.dateFilter?.length > 0 || filter?.normalFilter?.length > 0) {
      setInitialData(previousWeekData);
    } else {
      setInitialData(currentWeekData);
    }
  }, [filter?.dateFilter?.length, filter?.normalFilter?.length]);

  console.log(initialData);

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
                    dateFilter: ` ${firstDate} to ${secondDate} `,
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
        {filter?.dateFilter && (
          <div className="flex px-1 py-0.5 gap-1 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] w-[110px] text-[var(--dark-secondary-text)]">
                {filter.dateFilter?.toLocaleLowerCase().slice(0, 15)}
              </span>
            </div>
            <button
              onClick={() => setFilter((prev) => ({ ...prev, dateFilter: "" }))}
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
              data: initialData?.map((data) => data["date"]),
            },
          ]}
          series={dataKey?.map((key) => ({
            dataKey: key,
            label: key,
          }))}
        />
      </div>
    </div>
  );
};
