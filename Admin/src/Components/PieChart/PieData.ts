import { getCategories } from "../../Services/category.services";
import { Product } from "../../models/product.model";
import { Revenue } from "../../models/revenue.model";

export const aggregateDailyCategoryOrder = async (orders: Revenue[]) => {
  const categoryMap: { [key: string]: number } = {};

  orders.forEach((order) => {
    order?.orders?.forEach((product: Product) => {
      if (categoryMap[product.tagId]) {
        categoryMap[product.tagId] += Number(product.quantity);
      } else {
        categoryMap[product.tagId] = Number(product.quantity);
      }
    });
  });
  const allCategory = await getCategories();

  console.log(allCategory);

  // Combine small categories
  const combinedCategories = combineSmallCategories(categoryMap as any, 5);

  const categories = combinedCategories?.map((reveneu) => {
    let label: string = reveneu.label; // Start with the existing label

    if (label === "Others") {
      label = "others";
    } else {
      const matchingCategory = allCategory?.find(
        (category) => category.id === reveneu.label
      );
      if (matchingCategory) {
        label = matchingCategory.name;
      } else {
        label = "default"; // If no match is found, set default
      }
    }

    return {
      ...reveneu,
      label: label,
    };
  });

  return categories;
};

interface dataProp {
  label: Record<string, number>; // Assuming 'label' is a string-to-number mapping
  value: number;
}

export const combineSmallCategories = (
  data: dataProp[], // 'data' is an array of 'dataProp'
  minCount: number = 5
) => {
  const result: { label: string; value: number }[] = [];
  let othersTotal = 0;

  // Iterate over the 'data' array
  data.forEach((category) => {
    Object.keys(category.label).forEach((key) => {
      const value = category.label[key];

      if (value === undefined || value < minCount) {
        othersTotal += value || 0;
      } else {
        result.push({ label: key, value: value });
      }
    });
  });

  // If there's any category with value < minCount, add "Others" label
  if (othersTotal > 0) {
    result.push({ label: "Others", value: othersTotal });
  }

  return result;
};

