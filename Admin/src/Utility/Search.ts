import { DbUser } from "../models/UserModels";
import { Order } from "../models/order.model";

export const SearchCustomer = (customers: DbUser[], value: string) => {
  const searchingCustomer = customers?.filter((customer) => {
    return customer.fullName.toLowerCase().includes(value);
  });
  return searchingCustomer;
};

 export const SearchProduct = (customers: Order[], value: string) => {
  const searchingProduct = customers?.filter((order) => {
    return order.uid.toLowerCase().includes(value);
  });
  return searchingProduct;
};
