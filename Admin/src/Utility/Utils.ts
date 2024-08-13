import { getOrders } from "../Services";
import { getUserData } from "../firebase/db";
import { OrderProduct } from "../models/chart.modal";
import { Order, Product } from "../models/order.model";

// get fullName from userData to show in order table in customer column
export const getFullName = async (uid: string): Promise<string | null> => {
  try {
    const customerData = await getUserData("customer", uid);
    if (customerData && customerData.fullName) {
      return customerData.fullName;
    }

    // If customer name is not found, try to get the admin's full name
    const adminData = await getUserData("admin", uid);
    if (adminData && adminData.fullName) {
      return adminData.fullName;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
export const getUserInfo = async (uid: string) => {
  const user = await getUserData("customer", uid);
  if (user) return user;
  const admin = await getUserData("admin", uid);
  if (admin) return admin;
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
  typeof customerOrderCost;
  return customerOrderCost;
};

export const getOrderId = async () => {
  const orders = await getOrders();
  const totalOrders = orders.data as Order[];
  const orderId = totalOrders?.map((order) => order.orderId);
  return orderId;
};

export const getRevenue = (products: OrderProduct[]) => {
  const revenue = products?.reduce(
    (productQuan, product) => productQuan + product.price * product.quantity,
    1
  );
  return revenue;
};

export const getOrder = (orders: OrderProduct[]) => {
  const order = orders?.reduce((OrderQuan, od) => OrderQuan + od.quantity, 1);
  return order;
};
