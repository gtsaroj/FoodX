import { BannerModel } from "../models/banner.model";

export const SearchBanner = (categories: BannerModel[], value: string) => {
    const searchingCategory = categories?.filter((category) => {
      return category.title?.toLowerCase().includes(value);
    });
    return searchingCategory;
  };