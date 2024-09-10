import { DailyCategoryAgrregateData, Order } from "../../models/order.model";
import { Revenue } from "../../models/revenue.model";

export const aggregateDailyCategoryOrder = (orders: Revenue[]) => {
  const categoryMap: { [key: string]: number } = {};

  orders.forEach((order) => {
     console.log(order)
    order?.orders?.forEach((product: any) => {
      if (categoryMap[product.name]) {
        categoryMap[product?.name] += product?.quantity;
      } else {
        categoryMap[product?.name] = product?.quantity;
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
