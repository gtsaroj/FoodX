import { Category } from "../../models/category.model";
import { Product } from "../../models/product.model";
import { Revenue } from "../../models/revenue.model";

export const aggregateDailyCategoryOrder = async (
  orders: Revenue[],
  allCategory: Category[]
) => {
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
   
      if (matchingCategory && matchingCategory !== undefined) {
        label = matchingCategory.name;
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
  [key: string]: number; // Assuming 'data' is an object where keys are strings and values are numbers
}

export const combineSmallCategories = (
  data: dataProp, // Change to object
  minCount: number = 5
) => {
  const result: { label: string; value: number }[] = [];
  let othersTotal = 0;

  // Iterate over the keys of the object
  Object.keys(data).forEach((key) => {
    const value = data[key]; // Access the value using the key

    if (value === undefined || value < minCount) {
      othersTotal += value || 0;
    } else {
      result.push({ label: key, value: value });
    }
  });

  // If there's any category with value < minCount, add "Others" label
  if (othersTotal > 0) {
    result.push({ label: "Others", value: othersTotal });
  }

  return result;
};
