import { Product } from "./product.model";

interface Order_Timestamps {
  createdAt?: { _seconds?: number };
}

export interface status {
  status?: "pending" | "preparing" | "prepared" | "completed" | "cancelled";
}

export interface Order extends Order_Timestamps {
  orderId: string;
  name?: string;
  uid?: string;
  products: Product[];
  note?: string;
  orderRequest: string;
  status?: "pending" | "preparing" | "prepared" | "completed" | "cancelled";
  orderFullfilled?: string;
}

export interface OrderModal extends Omit<Order, "orderId"> {
  image: string;
  id?: string;
  rank?: number;
}
export interface RecentOrder extends Omit<Order, "products"> {
  image: string;
  price: number;
  products: string[];
}

export interface DailyAggregateData {
  title: string;
  total: string | number;
  percentage: number | string;
}

export interface FetchOrder {
  currentFirstDoc: string;
  currentLastDoc: string;
  orders: Order[];
  length: number;
}

export interface GetOrderModal extends status {
  pageSize?: number;
  filter?: keyof Order;
  sort?: "asc" | "desc";
  currentFirstDoc?: any | null;
  currentLastDoc?: any | null;
  direction?: "prev" | "next";
  userId?: string;
}

export interface DailyCategoryAgrregateData {
  label: string;
  value: string | number;
}

export interface CardAnalyticsProp {
  title: string;
  percentage?: number;
  subtitle?: string;
  filter?: React.ReactNode;
  total: number;
}
