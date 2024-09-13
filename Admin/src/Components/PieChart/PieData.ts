import {
  getNormalProducts,
  getSpecialProducts,
} from "../../Services/product.services";
import { Product } from "../../models/product.model";
import { Revenue } from "../../models/revenue.model";

export const aggregateDailyCategoryOrder = async (orders: Revenue[]) => {
  const categoryMap: { [key: string]: number } = {};
  const normalProducts = await getNormalProducts();
  const specialProducts = await getSpecialProducts();
  const allProducts = [
    ...normalProducts.data,
    ...specialProducts.data,
  ] as Product[];
  
  const aggregateProducts = orders?.map((order) => {
    const orderId = order.orders?.map((index) => index.id);

    const filterProducts = allProducts?.filter((product) =>
      orderId.includes(product.id)
    );
    return filterProducts;
  });

  orders.forEach((order) => {
    order?.orders?.forEach((product: any) => {
      if (product?.value === undefined) product.value = 0;
      if (categoryMap[product.name]) {
        categoryMap[product.name] += product.quantity;
      } else {
        categoryMap[product.name] = product.quantity;
      }
    });
  });

  // Combine small categories
  const combinedCategories = combineSmallCategories(categoryMap, 5);
  return combinedCategories;
};

export const combineSmallCategories = (
  data: { label: string; value: number | undefined }[],
  minCount: number = 5
) => {
  console.log(data);
  const result: { label: string; value: number }[] = [];
  let othersTotal = 0;
  console.log(Object.keys(data));

  Object.keys(data).forEach((order) => {
    if (data[order] === undefined || data[order] < minCount) {
      othersTotal += data[order] || 0;
    } else {
      result.push({ label: order, value: data[order] });
    }
  });

  // If there's any category with value < minCount, add "Others" label
  if (othersTotal > 0) {
    result.push({ label: "Others", value: othersTotal });
  }

  return result;
};
