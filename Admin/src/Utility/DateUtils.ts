import { DailyAggregateData, Order, RequestTime } from "../models/order.model";
import { totalRevenue } from "./Utils";

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
//
interface FormattedDateTime {
  date: string;
  time: string;
}

export const convertIsoToReadableDateTime = (
  isoString: string
): FormattedDateTime => {
  const date = new Date(isoString);

  // Using toLocaleString for formatted date and time
  const formattedDateTime = date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  });

  // Custom formatting for date and time separately
  const pad = (n: number) => (n < 10 ? "0" + n : n);

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are zero-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return {
    date: formattedDate,
    time: formattedTime,
  };
};

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
  console.log(currentOrderData);
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

    const dailAnalyticsData: DailyAggregateData[] = [
      {
        title: "Orders Delivered",
        total: totalDelivered,
        percentage: ` ${Math.round((totalDelivered / totalOrders) * 100)}`,
      },
      {
        title: "Orders Recieved",
        total: totalOrders,
        percentage: 100,
      },
      {
        title: "Revenue",
        total: revenue,
        percentage: ` ${Math.round((revenue / totalOrders) * 100)}`,
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
          title: "Orders Delivered",
          total: 0,
          percentage: 100,
        },
        {
          title: "Orders Recieved ",
          total: 0,
          percentage: 100,
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
    const revenue = totalRevenue(filterData);

    const dailAnalyticsData: DailyAggregateData[] = [
      {
        title: "Orders Recieved",
        total: totalOrders,
        percentage: 100,
      },
      {
        title: "Orders Delivered",
        total: totalDelivered,
        percentage: 100,
      },
      {
        title: "Revenue",
        total: revenue,
        percentage: ` ${(revenue / totalOrders) * 100}% in 1 day `,
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
