import { DbUser } from "../models/UserModels";
import { CategoryType } from "../models/category.model";
import { OrderModal, Product } from "../models/order.model";

export const SearchCustomer = (customers: DbUser[], value: string) => {
  const searchingCustomer = customers?.filter((customer) => {
    return customer.fullName.toLowerCase().includes(value);
  });
  return searchingCustomer;
};

export const SearchProduct = (customers: Product[], value: string) => {
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
