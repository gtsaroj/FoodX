import { DbUser } from "../models/UserModels";
import { Order, Product } from "../models/order.model";
import { Categories } from "../models/productMode";

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
export const SearchOrder = (customers: Order[], value: string) => {
  const searchingProduct = customers?.filter((order) => {
    return order.uid.toLowerCase().includes(value);
  });
  return searchingProduct;
};
export const SearchCategory = (
  categories: { category: string; image: any }[],
  value: string
) => {
  const searchingCategory = categories?.filter((category) => {
    return category.category.toLowerCase().includes(value);
  });
  return searchingCategory;
};
