import dayjs from "dayjs";
import { Order } from "../../models/order.model";
import { CardAnalytic } from "../../models/product.model";
import { totalRevenue } from "../../Utility/product.utils";

export const aggregateCurrentDayData = (orders: Order[]) => {
  try {
    // const today = new Date();
    // const todayString = today.toISOString().split("T")[0];

    const currentDayOrder = orders.filter((order) => {
      const orderDate = dayjs(order.orderFullfilled).format("YYYY-MM-DD");
      return "2024-04-07" === orderDate;
    });

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
      (_, order) => order.products.length,
      0
    );
    const revenue = totalRevenue(currentDayOrder);

    const dailAnalyticsData: CardAnalytic[] = [
      {
        title: "Orders Delivered",
        total: totalDelivered,
        percentage: ` ${Math.round((totalDelivered / totalOrders) * 100)}`,
      },
      {
        title: "Orders Recieved",
        total: totalOrders,
        percentage: ` ${Math.round((totalDelivered / totalOrders) * 100)}`,
      },
      {
        title: "Revenue",
        total: revenue,
        percentage: ` ${Math.round((revenue / totalOrders) * 100)}`,
      },
    ];

    return dailAnalyticsData;
  } catch (error) {
    throw new Error(`Failed to aggregate analytics card data ${error}`);
  }
};
