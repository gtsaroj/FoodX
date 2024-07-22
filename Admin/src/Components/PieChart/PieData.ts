import { DailyCategoryAgrregateData, Order } from "../../models/order.model";

export const aggregateDailyCategoryOrder = (orders: Order[]) => {
  // let category: DailyCategoryAgrregateData[];

  const categoryMap: { [key: string]: number } = {};
  // let currentWeekOrders: Order[] = [];
  // if (options === "current week")
  //   currentWeekOrders = aggregateDataCurrentWeek(orders);
  // if (options === "previous week")
  //   currentWeekOrders = aggregateDataPreviousWeek(orders);

  orders.forEach((order) => {
    order?.products?.forEach((product: any) => {
      if (categoryMap[product.tag]) {
        categoryMap[product?.tag] += product?.quantity;
      } else {
        categoryMap[product?.tag] = product?.quantity;
      }
    });
  });
  const dailyaggregateCategories: DailyCategoryAgrregateData[] = Object.keys(
    categoryMap
  ).map((tag) => ({
    label: tag,
    value: categoryMap[tag],
  }));

  return dailyaggregateCategories;
};
