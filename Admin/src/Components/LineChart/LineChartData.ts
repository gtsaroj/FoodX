import {
  aggregateDataCurrentMonth,
  aggregateDataCurrentWeek,
  aggregateDataPreviousMonth,
  convertTimestampToDate,
  dayNames,
} from "../../Utility/DateUtils";
import { Order } from "../../models/order.model";

const today = new Date();
export const Week = [
  today.getDay() + 1,
  today.getDay() + 2,
  today.getDay() + 3,
  today.getDay() + 4,
  today.getDay() + 5,
  today.getDay() + 6,
  today.getDay() + 7,
];

export function weekDateRoundUp() {
  const dateCollection: number[] = [];
  Week.forEach((date) => {
    if (date > 7) {
      const currentDate = date - 7;
      dateCollection.push(currentDate);
      return;
    }
    dateCollection.push(date);
  });
  return dateCollection;
}
// aggregate LineChart Weekly Data
export const aggregateLineDataWeekly = (orders: Order[]) => {
  const datas: { [key: string]: string | number }[] = [];

  const orderDataOfWeek = aggregateDataCurrentWeek(orders);

  orderDataOfWeek?.forEach((order) => {
    const orderDate = convertTimestampToDate(order.orderFullFilled);
    const dayName = dayNames[new Date(orderDate as string).getDay()];

    const weekData = datas.find((data) => data["week"] === dayName);
    if (!weekData) {
      datas.push({ week: dayName, revenue: 0 });
    }

    const productRevenue = order.products.reduce(
      (prodSum, product) => prodSum + product.price,
      0
    );

    const weekData1 = datas.find((data) => data["week"] === dayName);

    if (weekData1)
      weekData1.revenue = (weekData1.revenue as number) + productRevenue;
  });

  return datas;
};

// aggregate monthly date optionally
export const aggregateLineDataMonthly = (orders: Order[], option: string) => {
  const datas: { [key: string]: string | number }[] = [];

  let currentFilterData: Order[] = [];

  if (option === "previous month")
    currentFilterData = aggregateDataPreviousMonth(orders);
  if (option === "current month")
    currentFilterData = aggregateDataCurrentMonth(orders);

  currentFilterData?.forEach((order) => {
    const orderDate = convertTimestampToDate(order.orderFullFilled);
    const dayName = dayNames[new Date(orderDate as string).getDay()];

    const weekData = datas.find((data) => data["week"] === dayName);
    if (!weekData) datas.push({ week: dayName, revenue: 0 });

    const productRevenue = order.products.reduce(
      (prodSum, product) => prodSum + product.price,
      0
    );

    if (weekData)
      weekData.revenue = (weekData.revenue as number) + productRevenue;
  });

  return datas;
};
