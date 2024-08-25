import { CategoryType } from "../models/category.model";

export const SearchCategory = (categories: CategoryType[], value: string) => {
  const searchingCategory = categories?.filter((category) => {
    return category.name.toLowerCase().includes(value);
  });
  return searchingCategory;
};
