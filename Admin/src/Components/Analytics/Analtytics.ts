import dayjs from "dayjs";
import { CardAnalytic } from "../../models/product.model";
import { Revenue } from "../../models/revenue.model";

export const aggregateCurrentDayData = (orders: Revenue[]) => {
  try {
    const currentDayOrder = orders.filter((order) => {
      const today = dayjs().format("YYYY-MM-DD");
      const orderDate = dayjs(order.id).format("YYYY-MM-DD");
      return today === orderDate;
    });

    console.log(currentDayOrder);

    if (currentDayOrder.length === 0) {
      return [
        {
          title: "Orders Delivered",
          total: 0,
          percentage: 10,
          subtitle: `sell 0`,
        },
        {
          title: "Orders Received",
          total: 0,
          percentage: 100,
          subtitle: `sell 0`,
        },
        {
          title: "Revenue",
          total: 0,
          percentage: 10,
          subtitle: `sell 0`,
        },
      ];
    }

    const totalOrders = currentDayOrder.length;
    const totalDelivered = currentDayOrder?.reduce(
      (_, order) => order.orders.length,
      0
    );
    const revenue = getRevenue(currentDayOrder);

    const dailAnalyticsData: CardAnalytic[] = [
      {
        title: "Orders Delivered",
        total: totalDelivered,
        percentage: Math.round((totalDelivered / totalOrders) * 100),
      },
      {
        title: "Orders Recieved",
        total: totalOrders,
        percentage: Math.round((totalDelivered / totalOrders) * 100),
      },
      {
        title: "Revenue",
        total: revenue,
        percentage: Math.round((revenue / totalOrders) * 100) as number,
      },
    ];

    return dailAnalyticsData;
  } catch (error) {
    throw new Error(`Failed to aggregate analytics card data ${error}`);
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
