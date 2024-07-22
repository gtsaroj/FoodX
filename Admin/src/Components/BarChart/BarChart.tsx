import { BarChart } from "@mui/x-charts";
import { orderChartsOfMonthly } from "../LineChart/D";
// import { DropDown } from "../Common/DropDown/DropDown";
// import { getOrders } from "../../Services";
// import { aggregateBarData } from "../../Utility/DateUtils";
// import { Order } from "../../models/order.model";

// export const BarChartOfWeeklyOrder: React.FC = () => {
//   const [weeklyBarData, setWeeklyBarData] = useState<
//     { [key: string]: string }[]
//   >([]);

//   useEffect(() => {
//     getOrders().then((data: any) => {
//       const barData = aggregateBarData(data.data as Order[]);
//       setWeeklyBarData(barData);
//     });
//   }, []);
//   const productNames = Array.from(
//     new Set(
//       weeklyBarData.flatMap((data) =>
//         Object.keys(data).filter((key) => key !== "week")
//       )
//     )
//   );

//   console.log(productNames);

//   const valueFormatter = (value: number | null) => value;
//   return (
//     <div className="bg-[var(--light-background)] rounded py-2 w-full lg:w-[600px] h-[300px] sm:h-[400px] flex  flex-col items-start px-2 justify-center">
//       <h2 className="text-xl p-2 text-[var(--primary-color)] ">
//         Weekly Orders
//       </h2>
//       <BarChart
//         slotProps={{
//           legend: { hidden: true },
//         }}
//         xAxis={[{ scaleType: "band", disableLine: true, dataKey: "week" }]}
//         dataset={weeklyBarData} // Ensure this is correctly formatted
//         series={productNames?.map((product) => ({
//           dataKey: product,
//           label: product,
//           valueFormatter: valueFormatter,
//         }))}
//         sx={{
//           width: 100,
//           strokeWidth: 1,
//           cursor: "pointer",
//         }}
//       ></BarChart>
//     </div>
//   );
// };
interface MonthlyOrderChartProps {
  height: number;
}

export const MonthlyOrderChart: React.FC<MonthlyOrderChartProps> = ({
  height,
}: {
  height: number;
}) => {
  // const valueFormatter = (value: number | null) => value;
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
        dataset={orderChartsOfMonthly}
        borderRadius={6}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "week",
            data: ["Week 1", " Week 2", "Week 3", "Week 4"],
          },
        ]}
        series={[
          {
            dataKey: "samosa",
            label: "Samosa",
            // valueFormatter,
          },
          {
            dataKey: "pizza",
            label: "Pizza",
            // valueFormatter,
          },
          {
            dataKey: "cold_drinks",
            label: "Cold Drinks",
            // valueFormatter,
          },
          {
            dataKey: "others",
            label: "Others",
            // valueFormatter,
          },
        ]}
      />
    </div>
  );
};
