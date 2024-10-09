import dayjs from "dayjs";
import { getRevenue } from "../../Services/revenue.services";
import { Category } from "../../models/category.model";
import { Revenue } from "../../models/revenue.model";
import {
  getNormalProducts,
  getSpecialProducts,
} from "../../Services/product.services";
import { Product } from "../../models/product.model";

export const aggregateCategories = async (categories: Category[]) => {
  try {
    const [normalProducts, specialProducts, revenueData] = await Promise.all([
      getNormalProducts(),
      getSpecialProducts(),
      getRevenue({
        startDate: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
      }),
    ]);
    const products = [
      ...normalProducts.data,
      ...specialProducts.data,
    ] as Product[];

    const revenues = revenueData.data as Revenue[];

    const tagId = categories.map((category) => category.id);

    // Filter revenues to match the categories
    const matchedCategoryProducts = revenues.filter((revenue) =>
      revenue.orders.some((order) => tagId.includes(order.tagId))
    );

    //aggregate totalOrder & Revenue
    const allCategory = categories?.map((revenueCategory) => {
      let revenue: number = 0;
      let order: number = 0;
      let item: number = 0;
      matchedCategoryProducts?.forEach((category) => {
        if (
          category.orders.some((order) => order.tagId === revenueCategory.id)
        ) {
          revenue += category.orders.reduce(
            (acc, curr) => acc + Number(curr.price) * Number(curr.quantity),
            0
          );
          order += category.orders.reduce(
            (acc, order) => acc + Number(order.quantity),
            0
          );
        }
        products?.forEach((product) => {
          if (product.tagId === revenueCategory.id) {
            item += Number([{...product}].length);
          }
        });
      });
      return {
        ...revenueCategory,
        revenue: revenue,
        order: order,
        item: item,
      };
    });

    const maxSold = Math.max(...allCategory.map((category) => category.order));

    const aggregateCategory = allCategory.map((data: Category) => ({
      id: data.id,
      name: data.name,
      image: data.image,
      item: data.item,
      order: data.order,
      revenue: data.revenue,
      rank: Math.round((data.order / maxSold) * 5),
    }));
    console.log(aggregateCategory);
    return aggregateCategory;
  } catch (error) {
    return null;
  }
};
