import { order } from "../../../frontend/src/Services";
import { getOrders } from "../Services";
import { getUserData } from "../firebase/db";
import { Order, Product } from "../models/order.model";

// get fullName from userData to show in order table in customer column
export const getFullName = async (uid: string) => {
  const getName = (await getUserData("customers", uid)).fullName;
  return getName;
};

export const totalQuantity = (products: Product[]) => {
  const customerOrderQuantity = products?.reduce(
    (prodSum, product) => prodSum + product?.quantity,
    0
  );
  return customerOrderQuantity;
};

export const totalCost = (products: Product[]) => {
  const customerOrderCost = products?.reduce(
    (prodSum, product) => prodSum + product?.price,
    0
  );
  return customerOrderCost;
};

export const getOrderId = async () => {
  const orders = await getOrders();
  const totalOrders = orders.data as Order[];
  const orderId = totalOrders?.map((order) => order.orderId);
  return orderId;
};
