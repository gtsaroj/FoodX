import { DailyAggregateData, Order, RequestTime } from "../models/order.model";

export function convertTimestampToDate(timestamp: RequestTime) {
  if (timestamp) {
    const milliseconds =
      timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000;

    return new Date(milliseconds).toISOString().split("T")[0];
  }
}

// export function isSameWeek(date1: Date, date2: Date) {
//   const copydate = (date : any) => {
//     const dateCopy = new Date(date);
//       const diffDate = dateCopy.getDate() - dateCopy.getDay() + dateCopy.getDay()=== 0 ? -6 : 1;
//    }
// }

export const aggregateCurrentDayData = (orders: Order[]) => {
  try {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const currentDayOrder = orders.filter((order) => {
      const orderDate = convertTimestampToDate(order.orderFullFilled);
      return todayString === orderDate;
    });

    if (currentDayOrder.length === 0) {
      return [
        {
          title: "Orders",
          total: 0,
          percentage: 100,
        },
        {
          title: "Cancel",
          total: 0,
          percentage: 100,
        },
        {
          title: "Delivered",
          total: 0,
          percentage: 50,
        },
        {
          title: "Revenue",
          total: 0,
          percentage: 40,
        },
      ];
    }

    const totalOrders = currentDayOrder.length;
    const totalDelivered = currentDayOrder?.reduce(
      (_, order) => order.products.length,
      0
    );
    const totalRevenue = currentDayOrder?.reduce(
      (total, product) =>
        total +
        product?.products?.reduce(
          (productSum, product) => productSum + product.price,
          0
        ),
      0
    );

    const dailAnalyticsData: DailyAggregateData[] = [
      {
        title: "Orders",
        total: totalOrders,
        percentage: 100,
      },
      {
        title: "Cancel",
        total: totalOrders,
        percentage: 100,
      },
      {
        title: "Delivered",
        total: totalDelivered,
        percentage: ` ${(totalDelivered / totalOrders) * 100}% in 1 day `,
      },
      {
        title: "Revenue",
        total: totalRevenue,
        percentage: ` ${(totalRevenue / totalOrders) * 100}% in 1 day `,
      },
    ];

    return dailAnalyticsData;
  } catch (error) {
    console.log(`Failed to aggregate data ${error}`);
  }
};

export const aggregateWeeklyData = (orders: Order[], option: string) => {
  console.log(orders, option)
  const today = new Date();
  const startDate = new Date(today);
  const endDate = new Date(today);
  let filterData: Order[];
  try {
    // filterData of running week
    if (option === "current week") {
      startDate.setDate(today.getDate() - today.getDay());

      const currentWeeklyData = orders?.filter((order) => {
        const orderDates = convertTimestampToDate(order.orderFullFilled);
        return (
          orderDates &&
          orderDates >= startDate.toISOString().split("T")[0] &&
          orderDates <= endDate.toISOString().split("T")[0]
        );
      });
      currentWeeklyData ? (filterData = currentWeeklyData) : "";
    } else if (option === "previous week") {
      startDate.setDate(today.getDate() - today.getDay() - 6);
      endDate.setDate(today.getDate() - today.getDay());
      const previousWeeklyData = orders?.filter((order) => {
        const orderDates = convertTimestampToDate(order.orderFullFilled);
        return (
          orderDates &&
          orderDates >= startDate.toISOString().split("T")[0] &&
          orderDates <= endDate.toISOString().split("T")[0]
        );
      });
      previousWeeklyData ? (filterData = previousWeeklyData) : "";
    }

    if (filterData && filterData.length === 0) {
      return [
        {
          title: "Orders",
          total: 0,
          percentage: 100,
        },
        {
          title: "Cancel",
          total: 0,
          percentage: 100,
        },
        {
          title: "Delivered",
          total: 0,
          percentage: 50,
        },
        {
          title: "Revenue",
          total: 0,
          percentage: 40,
        },
      ];
    }

    const totalOrders = filterData.length;
    const totalDelivered = filterData?.reduce(
      (_, order) => order.products.length,
      0
    );
    const totalRevenue = filterData?.reduce(
      (total, product) =>
        total +
        product?.products?.reduce(
          (productSum, product) => productSum + product.price,
          0
        ),
      0
    );

    const dailAnalyticsData: DailyAggregateData[] = [
      {
        title: "Orders",
        total: totalOrders,
        percentage: 100,
      },
      {
        title: "Cancel",
        total: totalOrders,
        percentage: 100,
      },
      {
        title: "Delivered",
        total: totalDelivered,
        percentage: ` ${(totalDelivered / totalOrders) * 100}% in 1 day `,
      },
      {
        title: "Revenue",
        total: totalRevenue,
        percentage: ` ${(totalRevenue / totalOrders) * 100}% in 1 day `,
      },
    ];

    return dailAnalyticsData;
  } catch (error) {
    throw new Error("Unable to filtered weekly order");
  }
};
