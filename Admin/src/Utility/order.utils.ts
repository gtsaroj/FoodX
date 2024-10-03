import dayjs from 'dayjs';
import { OrderProduct } from "../models/chart.modal";
import { Order, OrderModal } from "../models/order.model";
import { Product } from "../models/product.model";
import { getRevenue as getRevenues } from "../Services/revenue.services";
dayjs

export const getOrderId = async () => {
  const orders = await getRevenues({startDate: dayjs().startOf("month").toISOString(),endDate: dayjs().toISOString()})
  const totalOrders = orders as Order[];
  const orderId = totalOrders?.map((order) => order.orderId);
  return orderId;
};

export const getRevenue = (products: Product[]) => {
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

export const SearchOrder = (Order: OrderModal[], value: string) => {
    const searchingProduct = Order?.filter((order) => {
      return order.name.toLowerCase().includes(value);
    });
    return searchingProduct;
  };
