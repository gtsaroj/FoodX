import { DailyAggregateData, Order, RequestTime } from "../models/order.model";
import { totalRevenue } from "./Utils";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import dayjs, { Dayjs } from "dayjs";

dayjs.extend(isSameOrAfter);

export function getTimeDifference(isoDateTime: string[]) {
  // Parse the ISO 8601 formatted date-time string
  if (!isoDateTime) return;
  const IsoTime = isoDateTime[0] + "T" + isoDateTime[1];

  const targetDate = new Date(IsoTime) as any;
  console.log(targetDate);
  const now = new Date() as any;

  const diffMs = now - targetDate;
  // Convert milliseconds to minutes and hours
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);

  const remainingMinutes = diffMinutes % 60;

  // Ensure the difference is non-negative
  return {
    hoursLeft: Math.max(0, diffHours),
    minutesLeft: Math.max(0, remainingMinutes),
  };
}
export const parseDateString = (dateString: string): Date => {
  const [datePart, timePart] = dateString.split(" | ");
  const [month, day] = datePart.split("-").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  // Use the current year, as the year is not provided in the string
  const year = new Date().getFullYear();

  return new Date(year, month - 1, day, hours, minutes, seconds);
};

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
  const today = dayjs();
  const startDate = today.date(0).toISOString();
  const endDate = today.toISOString();

  const datas = orders?.filter((order) => {
    const orderDate = convertTimestampToDate(order.orderFullFilled);
    return orderDate && orderDate >= startDate && orderDate <= endDate;
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
    // const today = new Date();
    // const todayString = today.toISOString().split("T")[0];

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

//bardata
export const barData = async (data: Order[]) => {
  const today = dayjs().format("YYYY-MM-DD");
  const datas: { [key: string]: string }[] = [];

  data?.forEach((order) => {
    const orderDate = dayjs(order.orderRequest).format("YYYY-MM-DD");

    let foundOrder = false;
    datas.forEach((data) => {
      data["time"] === orderDate;
      foundOrder = true;
    });

    if (!foundOrder) datas.push({ time: orderDate });

    datas?.forEach((data) => {
      order?.products?.forEach((product) => {
        if (data["time"] === orderDate) {
          data[product.name]
            ? (data[product.name] += product.quantity as number)
            : (data[product.name] = product.quantity as any);
        }
      });
    });
  });
  return datas;
};

export const filterBarData = async (
  data: Order[],
  time: { startDate: Dayjs; endDate: Dayjs }
) => {
  const filterData = data.filter((order) => {
    const orderDate = order.orderRequest;

    return (
      orderDate >= time.startDate.toISOString() &&
      orderDate <= time.endDate.toISOString()
    );
  });
  const filterOrderData = barData(filterData);
  return filterOrderData;
};

export const filterBarTodayData = async (data: Order[]) => {
  // Get today's date
  const today = dayjs();

  // Calculate the start and end of the current month
  const startOfMonth = today.startOf("month").format("YYYY-MM-DD");
  const endOfMonth = today.endOf("month").format("YYYY-MM-DD");
  console.log(startOfMonth, endOfMonth);

  // Filter data for the current month
  const filteredData = data.filter((order) => {
    const orderDate = dayjs(order.orderRequest).format("YYY-MM-DD");
    return startOfMonth >= orderDate && orderDate <= endOfMonth;
  });

  const filterOrderData = barData(filteredData);
  return filterOrderData;
};
