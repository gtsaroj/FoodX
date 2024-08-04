import { DbUser } from "../models/UserModels";
import { BannerModel } from "../models/banner.model";
import { CategoryType } from "../models/category.model";
import { OrderModal, Product } from "../models/order.model";
import { ArrangedProduct } from "../models/productMode";
import { CustomerType } from "../models/user.model";

export const SearchCustomer = (customers: CustomerType[], value: string) => {
  const searchingCustomer = customers?.filter((customer) => {
    return customer.name.toLowerCase().includes(value);
  });
  return searchingCustomer;
};

export const SearchProduct = (customers: ArrangedProduct[], value: string) => {
  const searchingProduct = customers?.filter((order) => {
    return order.name.toLowerCase().includes(value);
  });
  return searchingProduct;
};
export const SearchOrder = (Order: OrderModal[], value: string) => {
  const searchingProduct = Order?.filter((order) => {
    return order.name.toLowerCase().includes(value);
  });
  return searchingProduct;
};
export const SearchCategory = (categories: CategoryType[], value: string) => {
  const searchingCategory = categories?.filter((category) => {
    return category.name.toLowerCase().includes(value);
  });
  return searchingCategory;
};
export const SearchBanner = (categories: BannerModel[], value: string) => {
  const searchingCategory = categories?.filter((category) => {
    return category.title?.toLowerCase().includes(value);
  });
  return searchingCategory;
};
