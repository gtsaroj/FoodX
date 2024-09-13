import dayjs from "dayjs";
import { CardAnalytic } from "../../models/product.model";
import { Revenue } from "../../models/revenue.model";
export const aggregateCurrentDayData = (orders: Revenue[]) => {
  const today = dayjs().format("YYYY-MM-DD");

  try {
    const currentDayOrder = orders.find((order) => {
      const orderDate = dayjs(order.id).format("YYYY-MM-DD");
      return today === orderDate;
    });

    const total7DaysOrders = orders.filter((order) => {
      const orderDate = dayjs(order.id).format("YYYY-MM-DD");
      const last7Days = dayjs().subtract(7, "days").format("YYYY-MM-DD");
      return orderDate >= last7Days && orderDate <= today;
    });

    // Calculate average orders and average revenue per day over the past 7 days
    const totalRevenueLast7Days = getRevenue(total7DaysOrders);

    console.log(total7DaysOrders);

    const totalOrderProductsInAWeek = total7DaysOrders.reduce(
      (acc, order) => acc + order.orders.length,
      0
    );
    const revenueToday = getRevenue([currentDayOrder] as Revenue[]);

    // Generate analytics data
    const dailyAnalyticsData: CardAnalytic[] = [
      {
        title: "Items Delivered",
        total: currentDayOrder!.orders.length,
        percentage: 100,
      },
      {
        title: "Average Items",
        total: Math.round(totalOrderProductsInAWeek / 7),
        percentage: Math.round(
          (totalOrderProductsInAWeek / 7 / totalOrderProductsInAWeek) * 100
        ),
      },
      {
        title: "Revenue",
        total: revenueToday,
        percentage: Math.round((revenueToday / totalRevenueLast7Days) * 100), // Revenue percentage based on average
      },
    ];
    console.log(dailyAnalyticsData);

    return dailyAnalyticsData;
  } catch (error) {
    throw new Error(`Failed to aggregate analytics card data: ${error}`);
  }
};

const getRevenue = (revenue: Revenue[]) => {
  const total = revenue.reduce(
    (acc, rev) =>
      acc +
      rev.orders.reduce(
        (innerAcc, product) =>
          innerAcc + Number(product.quantity) * Number(product.price),
        0
      ),
    0
  );

  return total; // Ensure the total is returned
};
