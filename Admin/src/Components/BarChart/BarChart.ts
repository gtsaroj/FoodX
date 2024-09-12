import dayjs from "dayjs";
import { Product } from "../../models/product.model";
import { DailyOrders } from "../../models/chart.modal";
import { Revenue } from "../../models/revenue.model";

//bardata
// export const barData = async (data: Order[]) => {
//     const today = dayjs().format("YYYY-MM-DD");
//     const datas: { [key: string]: string }[] = [];

//     data?.forEach((order) => {
//       const orderDate = dayjs(order.orderRequest).format("YYYY-MM-DD");

//       let foundOrder = false;
//       datas.forEach((data) => {
//         data["time"] === orderDate;
//         foundOrder = true;
//       });

//       if (!foundOrder) datas.push({ time: orderDate });

//       datas?.forEach((data) => {
//         order?.products?.forEach((product) => {
//           if (data["time"] === orderDate) {
//             data[product.name]
//               ? (data[product.name] += product.quantity as number)
//               : (data[product.name] = product.quantity as any);
//           }
//         });
//       });
//     });
//     return datas;
//   };

//   export const filterBarData = async (
//     data: Order[],
//     time: { startDate: Dayjs; endDate: Dayjs }
//   ) => {
//     const filterData = data.filter((order) => {
//       const orderDate = order.orderRequest;

//       return (
//         orderDate >= time.startDate.toISOString() &&
//         orderDate <= time.endDate.toISOString()
//       );
//     });
//     const filterOrderData = barData(filterData);
//     return filterOrderData;
//   };

//   export const filterBarTodayData = async (data: Order[]) => {
//     // Get today's date
//     const today = dayjs();

//     // Calculate the start and end of the current month
//     const startOfMonth = today.startOf("month").format("YYYY-MM-DD");
//     const endOfMonth = today.endOf("month").format("YYYY-MM-DD");
//     console.log(startOfMonth, endOfMonth);

//     // Filter data for the current month
//     const filteredData = data.filter((order) => {
//       const orderDate = dayjs(order.orderRequest).format("YYY-MM-DD");
//       return startOfMonth >= orderDate && orderDate <= endOfMonth;
//     });

//     const filterOrderData = barData(filteredData);
//     return filterOrderData;
//   };

export const barData = (data: Revenue[]) => {
  if (!data) throw new Error("No found data : file: barchart.ts => line:72");
  try {
    const allOrder = data.map((order) => {
      const products = productWithQuantity(order.orders);
      const processedProducts = combineSmallCategories(products, 5);
      return {
        ...processedProducts,
        time: order.id,
      };
    });
    return allOrder;
  } catch (error) {
    throw new Error(
      "Unable to aggregate bar data : file: barchart.ts => line:76" + error
    );
  }
};

export const productWithQuantity = (orders: Product[]) => {
  const datas: { [key: string]: number } = {};
  orders?.forEach((data) => {
    datas[data.name]
      ? (datas[data.name] += Number(data.quantity))
      : (datas[data.name] = Number(data.quantity));
  });

  return datas;
};

export const monthlyBarData = (orders: DailyOrders[]) => {
  if (!orders) throw new Error("No data found : line=> 101");
  const response = barData(orders);
  const allBarData = getOrderWeeklyTotal(response);
  return allBarData;
};

type AggregateMonthlyData = {
  [key: string]: number;
  time: string;
};

type WeeklyOrders = {
  [key: string]: number;
  time: string;
}[];

export const getOrderWeeklyTotal = (
  aggregateMonthlyData: AggregateMonthlyData[]
): WeeklyOrders => {
  const MAX_PRODUCTS = 4;
  const weeklyOrders: WeeklyOrders = [];

  let weekNumber = 1;
  let weeklyTotal: { [key: string]: number } = {};

  for (let i = 0; i < aggregateMonthlyData.length; i++) {
    const currentData = aggregateMonthlyData[i];
    const currentDate = dayjs(currentData.time).date();
    const isCurrentWeek = Math.ceil(currentDate / 7);

    if (isCurrentWeek === weekNumber) {
      Object.keys(currentData).forEach((key) => {
        if (key !== "time") {
          weeklyTotal[key] = (weeklyTotal[key] || 0) + currentData[key];
        }
      });
    } else {
      // Process the aggregated weekly data
      const sortedEntries = Object.entries(weeklyTotal).sort(
        (a, b) => b[1] - a[1]
      );
      const topProducts = sortedEntries.slice(0, MAX_PRODUCTS);
      const otherTotal = sortedEntries
        .slice(MAX_PRODUCTS)
        .reduce((sum, [, quantity]) => sum + quantity, 0);

      const weekData = topProducts.reduce((acc, [product, quantity]) => {
        acc[product] = quantity;
        return acc;
      }, {} as { [key: string]: number });

      if (otherTotal > 0) {
        weekData["Others"] = otherTotal;
      }

      weeklyOrders.push({
        ...weekData,
        time: aggregateMonthlyData[i - 1].time, // Use the last date of the completed week
      });

      // Reset the weekly total for the new week
      weeklyTotal = {};
      weekNumber = isCurrentWeek;

      // Aggregate the current day's data for the new week
      Object.keys(currentData).forEach((key) => {
        if (key !== "time") {
          weeklyTotal[key] = (weeklyTotal[key] || 0) + currentData[key];
        }
      });
    }

    // Handle the last week (push data at the end of the loop)
    if (i === aggregateMonthlyData.length - 1) {
      const sortedEntries = Object.entries(weeklyTotal).sort(
        (a, b) => b[1] - a[1]
      );
      const topProducts = sortedEntries.slice(0, MAX_PRODUCTS);
      const otherTotal = sortedEntries
        .slice(MAX_PRODUCTS)
        .reduce((sum, [, quantity]) => sum + quantity, 0);

      const weekData = topProducts.reduce((acc, [product, quantity]) => {
        acc[product] = quantity;
        return acc;
      }, {} as { [key: string]: number });

      if (otherTotal > 0) {
        weekData["Others"] = otherTotal;
      }

      weeklyOrders.push({
        ...weekData,
        time: currentData.time, // Use the last date for the last week
      });
    }
  }

  return weeklyOrders;
};

export const combineSmallCategories = (
  data: { [key: string]: number },
  minCount: number
) => {
  const entries = Object.entries(data);

  if (entries.length <= minCount) return data;

  // Sort categories by quantity in descending order
  const sortedEntries = entries.sort((a, b) => b[1] - a[1]);

  // Keep the top categories and combine the rest as "Others"
  const topCategories = sortedEntries.slice(0, minCount);
  const others = sortedEntries.slice(minCount);

  // Calculate the total for "Others"
  const othersTotal = others.reduce((acc, [_, quantity]) => acc + quantity, 0);

  // Return a new object with the top categories and "Others"
  const result = Object.fromEntries(topCategories);
  result["Others"] = othersTotal;

  return result;
};
