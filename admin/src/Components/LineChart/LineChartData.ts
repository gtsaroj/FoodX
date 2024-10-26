import { getRevenue } from "../../Utility/order.utils";
import { Product } from "../../models/product.model";
import { Revenue, RevenueInfo } from "../../models/revenue.model";
import dayjs from "dayjs";

// revenue data
export const revenueData = (data: RevenueInfo[]) => {
  if (!data) throw new Error("data not found");
  try {
    const orders = data.map((order): { revenue: number; time: string } => {
      const revenue = getRevenue(order.orders);
      return {
        revenue: revenue,
        time: order.id,
      };
    });
    return orders;
  } catch (error) {
    throw new Error("Unable to aggregate daily revenue data" + error);
  }
};

// monthly revenue
export const monthlyRevenue = (data: RevenueInfo[]) => {
  if (!data)
    throw new Error(
      "data not found in weekly revenue : file=> linchartdata.ts"
    );
  try {
    const revenue = revenueData(data);
    const monthlyData = getWeekTotal(revenue);
    return monthlyData;
  } catch (error) {
    throw new Error(
      "Unable to get weekly revenue : file=> linechartdata.ts" + error
    );
  }
};

// get revenue  weekly-wise
export const getWeekTotal = (
  aggregateMonthlyData: {
    revenue: number;
    time: string;
  }[]
) => {
  const weeklyOrders: { time: string; revenue: number }[] = [];

  let weekNumber = 1;
  let weeklyTotal = 0;

  for (let i = 0; i < aggregateMonthlyData.length; i++) {
    const currentOrder = aggregateMonthlyData[i];

    // Calculate which week the current order belongs to
    const dayOfMonth = dayjs(currentOrder.time).date();
    const currentWeek = Math.ceil(dayOfMonth / 7);

    if (currentWeek === weekNumber) {
      weeklyTotal += currentOrder.revenue;
    } else {
      // Push the next week data
      weeklyOrders.push({
        time: `Week ${weekNumber}`,
        revenue: weeklyTotal,
      });

      // Reset and start new week
      weekNumber = currentWeek;
      weeklyTotal = currentOrder.revenue;
    }
  }

  // Push the last week data
  if (weeklyTotal > 0) {
    weeklyOrders.push({
      time: `Week ${weekNumber}`,
      revenue: weeklyTotal,
    });
  }

  return weeklyOrders;
};

export const orderData = (data: Revenue[]) => {
  if (!data) throw new Error("data not found");
  try {
    const orders = data.map((order): { orders: number; time: string } => {
      const orders = totalOrder(order.orders);
      return {
        orders: orders,
        time: order.id,
      };
    });
    return orders;
  } catch (error) {
    throw new Error("Unable to aggregate daily orders data" + error);
  }
};

// calculate total order
const totalOrder = (products: Product[]) => {
  const total = products.reduce(
    (acc, order) => acc + Number(order.quantity as number),
    0
  );
  return total;
};

export const totalMonthOrder = (data: Revenue[]) => {
  if (!data)
    throw new Error(
      "data not found in weekly revenue : file=> linchartdata.ts"
    );
  try {
    const order = orderData(data);
    const monthlyData = getOrderWeeklyTotal(order);
    return monthlyData;
  } catch (error) {
    throw new Error(
      "Unable to get weekly revenue : file=> linechartdata.ts" + error
    );
  }
};

const getOrderWeeklyTotal = (
  aggregateMonthlyData: {
    orders: number;
    time: string;
  }[]
) => {
  const weeklyOrders: { time: string; orders: number }[] = [];

  let weekNumber = 1;
  let weeklyTotal = 0;

  for (let i = 0; i < aggregateMonthlyData.length; i++) {
    const currentOrder = aggregateMonthlyData[i];

    // Calculate which week the current order belongs to
    const dayOfMonth = dayjs(currentOrder.time).date();
    const currentWeek = Math.ceil(dayOfMonth / 7);

    if (currentWeek === weekNumber) {
      weeklyTotal += currentOrder.orders;
    } else {
      // Push the previous week data
      weeklyOrders.push({
        time: `Week ${weekNumber}`,
        orders: weeklyTotal,
      });

      // Reset and start new week
      weekNumber = currentWeek;
      weeklyTotal = currentOrder.orders;
    }
  }

  // Push the last week data
  if (weeklyTotal > 0) {
    weeklyOrders.push({
      time: `Week ${weekNumber}`,
      orders: weeklyTotal,
    });
  }

  return weeklyOrders;
};

export const calculateTotalOrders = (data: { time: string; orders: number }[]) => {
  
  return data.reduce((total, current) => total + current.orders, 0);
};

export const calculateTotalRevenue = (data: { time: string; revenue: number }[]) => {
  console.log(data)
  
  return data?.reduce((total, current) => total + current?.revenue, 0);
};

