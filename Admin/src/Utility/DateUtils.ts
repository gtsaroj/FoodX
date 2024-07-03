import {
  DailyAggregateData,
  Order,
  RequestTime,
} from "../models/order.model";

// Day Name
export const dayNames: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// convert timestamp
export function convertTimestampToDate(timestamp: RequestTime) {
  if (timestamp) {
    const milliseconds =
      timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000;

    return new Date(milliseconds).toISOString().split("T")[0];
  }
}
// aggregate current week data
export const aggregateDataCurrentWeek = (orders: Order[]) => {
  const today = new Date();
  const startDay = new Date(today);
  const endDay = new Date(today);

  startDay.setDate(today.getDate() - today.getDay());

  const currentOrderData = orders?.filter((order) => {
    const orderDate = convertTimestampToDate(order.orderFullFilled);
    return (
      orderDate &&
      orderDate >= startDay.toISOString().split("T")[0] &&
      orderDate <= endDay.toISOString().split("T")[0]
    );
  });
  console.log(currentOrderData)
  return currentOrderData;
};

// aggregate previous week data
export const aggregateDataPreviousWeek = (orders: Order[]) => {
  const today = new Date();
  const startDay = new Date(today);
  const endDay = new Date(today);

  startDay.setDate(today.getDate() - today.getDay() - 6);
  endDay.setDate(today.getDate() - today.getDay());

  const prevOrderData = orders?.filter((order) => {
    const orderDate = convertTimestampToDate(order.orderFullFilled);
    return (
      orderDate &&
      orderDate >= startDay.toISOString().split("T")[0] &&
      orderDate <= endDay.toISOString().split("T")[0]
    );
  });
  return prevOrderData;
};

// aggregate current Month
export const aggregateDataCurrentMonth = (orders: Order[]) => {
  const today = new Date();
  const startDay = new Date(today);
  const endDay = new Date(today);
  startDay.setDate(1);

  const datas = orders?.filter((order) => {
    const orderDate = convertTimestampToDate(order.orderFullFilled);
    return (
      orderDate &&
      orderDate >= startDay.toISOString().split("T")[0] &&
      orderDate <= endDay.toISOString().split("T")[0]
    );
  });
  return datas;
};

// aggregate previous Month
export const aggregateDataPreviousMonth = (orders: Order[]) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(startDate.getMonth() - 1);
  startDate.setDate(1);

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getDate() + 1);
  endDate.setDate(0);

  const datas = orders?.filter((order) => {
    const orderDate = convertTimestampToDate(order.orderFullFilled);
    return (
      orderDate &&
      orderDate >= startDate.toISOString().split("T")[0] &&
      orderDate <= endDate.toISOString().split("T")[0]
    );
  });
  return datas;
};

export const aggregateCurrentDayData = (orders: Order[]) => {
  try {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const currentDayOrder = orders.filter((order) => {
      const orderDate = convertTimestampToDate(order.orderFullFilled);
      return "2024-04-07" === orderDate;
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
        percentage: ` ${Math.round((totalDelivered / totalOrders) * 100)}`,
      },
      {
        title: "Revenue",
        total: totalRevenue,
        percentage: ` ${Math.round((totalRevenue / totalOrders) * 100)}`,
      },
    ];

    return dailAnalyticsData;
  } catch (error) {
    console.log(`Failed to aggregate data ${error}`);
  }
};

export const aggregateWeeklyData = (orders: Order[], option: string) => {
  let filterData: Order[] = [];
  try {
    // filterData of running week
    if (option === "current week") {
      const currentWeeklyData = aggregateDataCurrentWeek(orders);
      currentWeeklyData ? (filterData = currentWeeklyData) : "";
    }
    // filterdata of prev week
    else if (option === "previous week") {
      const previousWeeklyData = aggregateDataPreviousWeek(orders);
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

export const aggregateBarData = (orders: Order[]) => {
  let datas: { [key: string]: string }[] = [];

  orders?.forEach((order) => {
    const orderDate = convertTimestampToDate(order.orderFullFilled);
    const orderDay = dayNames[new Date(orderDate as string).getDay() as any];

    // check date exist or not
    let found: boolean = false;

    datas.forEach((data) => {
      if (data["week"] === orderDay) found = true;
    });

    if (!found) datas.push({ week: orderDay } as { [key: string]: string });

    datas?.forEach((data) => {
      order?.products?.forEach((product) => {
        if (data["week"] === orderDay) {
          data[product.name]
            ? (data[product.name] += product.quantity)
            : (data[product.name] = product.quantity);
        }
      });
    });
  });
  console.log(datas);
  return datas;
};
