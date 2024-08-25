import { DailyOrders } from "../../models/chart.modal";
import { getOrder, getRevenue } from "../../Utility/order.utils";
import dayjs from "dayjs";

export const revenueData = (data: DailyOrders[]) => {
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

export const weeklyRevenue = (data: DailyOrders[]) => {
  if (!data)
    throw new Error(
      "data not found in weekly revenue : file=> linchartdata.ts"
    );
  try {
    const revenue = revenueData(data).slice(0, 7);
    return revenue;
  } catch (error) {
    throw new Error(
      "Unable to get weekly revenue : file=> linechartdata.ts" + error
    );
  }
};

export const monthlyRevenue = (data: DailyOrders[]) => {
  if (!data)
    throw new Error(
      "data not found in weekly revenue : file=> linchartdata.ts"
    );
  try {
    const revenue = revenueData(data).slice(0, 34);
    const monthlyData = getWeekTotal(revenue);
    return monthlyData;
  } catch (error) {
    throw new Error(
      "Unable to get weekly revenue : file=> linechartdata.ts" + error
    );
  }
};

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
      // Push the previous week data
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

export const orderData = (data: DailyOrders[]) => {
  if (!data) throw new Error("data not found");
  try {
    const orders = data.map((order): { orders: number; time: string } => {
      const orders = getOrder(order.orders);
      return {
        orders: orders,
        time: order.id,
      };
    });
    return orders;
  } catch (error) {
    throw new Error("Unable to aggregate daily revenue data" + error);
  }
};

export const monthlyTotal = (data: DailyOrders[]) => {
  if (!data)
    throw new Error(
      "data not found in weekly revenue : file=> linchartdata.ts"
    );
  try {
    const order = orderData(data).slice(0, 34);
    const monthlyData = getOrderWeeklyTotal(order);
    return monthlyData;
  } catch (error) {
    throw new Error(
      "Unable to get weekly revenue : file=> linechartdata.ts" + error
    );
  }
};
export const previousMonthOrder = (data: DailyOrders[]) => {
  if (!data)
    throw new Error(
      "data not found in weekly revenue : file=> linchartdata.ts"
    );
  try {
    const order = orderData(data).slice(0, 34);
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
