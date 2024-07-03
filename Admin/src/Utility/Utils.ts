import { getUserData } from "../firebase/db";
import { Product } from "../models/order.model";

// get fullName from userData to show in order table in customer column
export const getFullName = async (uid: string) => {
  const getName = (await getUserData("customers", uid)).fullName;
  return getName;
};

export const totalQuantity = (products: Product[]) => {
  const customerOrderQuantity = products?.reduce(
    (prodSum, product) => prodSum + product?.quantity,
    1
  );
  return customerOrderQuantity;
};

export const totalCost = (products: Product[]) => {
  const customerOrderCost = products?.reduce(
    (prodSum, product) => prodSum + product?.price,
    1
  );
  return customerOrderCost;
};
