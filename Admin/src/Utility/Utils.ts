import { getOrders } from "../Services";
import { getUserData } from "../firebase/db";
import { Order, Product } from "../models/order.model";

// get fullName from userData to show in order table in customer column
export const getFullName = async (uid: string) => {
  const getName = (await getUserData("customers", uid)).fullName;
  return getName;
};
export const getUserInfo = async (uid: string) => {
  console.log(uid)
  const user = await getUserData("customers", uid);
  return user;
};

export const totalQuantity = (products: Product[]) => {
  const customerOrderQuantity = products?.reduce(
    (prodSum, product) => prodSum + product?.quantity,
    0
  );
  return customerOrderQuantity;
};
// total Revenue
export const totalRevenue = (orders: Order[]) => {
  const revenue = orders?.reduce(
    (total, order) =>
      total +
      order?.products.reduce(
        (totalProd, product) => totalProd + product.price,
        1
      ),

    1
  );
  return revenue;
};

export const totalCost = (products: Product[]) => {
  
  const customerOrderCost = products?.reduce(
    (prodSum, product) => prodSum + product?.price,
    0
  );
  typeof(customerOrderCost)
  return customerOrderCost;
};

export const getOrderId = async () => {
  const orders = await getOrders();
  const totalOrders = orders.data as Order[];
  const orderId = totalOrders?.map((order) => order.orderId);
  return orderId;
};
