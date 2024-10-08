import { Category } from "../models/category.model";

export const SearchCategory = (categories: Category[], value: string) => {
  const searchingCategory = categories?.filter((category) => {
    return category.name.toLowerCase().includes(value.toLowerCase());
  });
  return searchingCategory;
};
