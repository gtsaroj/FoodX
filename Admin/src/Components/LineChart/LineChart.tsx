import { LineChart } from "@mui/x-charts";
import { ArrowUp, Filter } from "lucide-react";
import "./LineChart.css";
import { DropDown } from "../Common/DropDown/DropDown";
// import { getOrders } from "../../Services";
// import { aggregateLineDataMonthly } from "./LineChartData";
// import { Order } from "../../models/order.model";
import { weekOrderRevenue as orderRevenue } from "../../data.json";

export const WeekReveneuChart: React.FC = () => {
  /*
  // useEffect(() => {
  //   getOrders().then((data) => {
  //     const revenueOfOrders = aggregateLineDataMonthly(data.data as Order[], "current month");
  //     console.log(revenueOfOrders)
  //     setOrderRevenue(revenueOfOrders);
  //   });
  // }, []);

  // useEffect(() => {
  //   const dailyRevenue : string[] | number[] = []

  //   if (orderRevenue) {
  // const lastIndexOfOrder = orderRevenue.length -1
  //     orderRevenue?.forEach((order) => {
  //     dailyRevenue.push(order.revenue as never)
  //     })
  //   }
  // console.log(orderRevenue)
  // const currentDayRevenue : string | number = orderRevenue[orderRevenue.length - 1].revenue;
  // const weeklyRevenue = dailyRevenue.slice(-7);

  // const percentageChanges = weeklyRevenue.map((revenue) => {
  //   return ((currentDayRevenue - revenue) / revenue) * 100;
  // });

  // },[orderRevenue])
*/
  return (
    <div className="flex flex-col items-center justify-center w-full gap-5 px-3 py-5 rounded">
      <div className="flex items-center justify-between w-full gap-3 px-2">
        <div className="text-left text-xl text-[var(--dark-text)] flex justify-center items-center gap-3">
          <p className="text-nowrap">Weekly Revenue</p>
          <p className="text-sm text-[var(--green-text)] p-1 flex justify-center items-center gap-0.5 border border-[var(--green-text)] rounded-lg">
            10%
            <span>
              <ArrowUp size={15} />
            </span>
          </p>
        </div>
        <div className="flex items-center justify-between w-full p-2">
          <DropDown
            style={{
              display: "flex",
              fontSize: "14px",
              borderRadius: "4px",
              padding: "0.5rem 1rem 0.5rem 1rem",
              color: "var(--dark-secondary-text)",
              border: "1px solid var(--light-secondary-text)  ",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: "",
            }}
            children={
              <>
                <Filter size={15} />
                <span>Filter</span>
              </>
            }
            options={["Current Week", "1 week ago"]}
          />
        </div>
      </div>
      <div className="h-[400px] lg:h-[300px] w-full">
        <LineChart
          slotProps={{
            legend: {
              direction: "row",
              labelStyle: { fontSize: "14px" },
              position: { vertical: "bottom", horizontal: "middle" },
            },
          }}
          xAxis={[
            {
              data: orderRevenue?.map((order) => order["week"]),
              scaleType: "point",
            },
          ]}
          series={[
            {
              data: orderRevenue?.map((order) => order["revenue"]),
              type: "line",
              color: "#45c241",
            },
          ]}
          skipAnimation={true}
          grid={{ vertical: true, horizontal: true }}
        ></LineChart>
      </div>
    </div>
  );
};

export const MonthlyRevenueChart = () => {};

// export const MonthlyRevenueChart: React.FC = () => {
//   const [orderRevenue, setOrderRevenue] = useState<
//     { [key: string]: string | number }[]
//   >([]);

//   const handleSelect = async (option: string) => {
//     const allOrders = await getOrders();
//     const filterRevenue = aggregateLineDataMonthly(allOrders.data, option);
//     setOrderRevenue(filterRevenue);
//   };

//   useEffect(() => {
//     getOrders().then((data) => {
//       const revenueOfOrders = aggregateLineDataMonthly(
//         data.data as Order[],
//         "current month"
//       );
//       setOrderRevenue(revenueOfOrders);
//     });
//   }, []);

//   console.log(orderRevenue);

//   return (
//     <div className="w-full  flex flex-col items-start justify-center px-4 py-5 h-[250px] sm:h-[400px] bg-[var(--light-background)] ">
//       <h2 className="w-full text-left pb-4  text-xl text-[var(--primary-color)] ">
//         Monthly Revenue
//       </h2>
//       <div className="w-full">
//         <DropDown
//           onSelect={handleSelect}
//           options={["Current week", "Previous week"]}
//         />
//       </div>
//       <LineChart
//         xAxis={[
//           {
//             data: orderRevenue?.map((order) => order["week"]),
//             scaleType: "point",
//           },
//         ]}
//         series={[
//           {
//             data: orderRevenue?.map((order) => order["revenue"]),
//           },
//         ]}
//       />
//     </div>
//   );
// };
