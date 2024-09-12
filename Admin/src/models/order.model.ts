import { extend } from "dayjs";
import { Product } from "./product.model";

export interface Order {
  orderId: string;
  name: string;
  uid: string;
  products: Product[];
  rank?: string;
  note?: string;
  orderRequest: string;
  status: "Received" | "Preparing" | "Cancelled" | "Pending";
  orderFullfilled: string;
  updatedAt?: Date;
}

export interface RecentOrder extends Order {
  image: string;
  price: string;
}

export interface DailyAggregateData {
  title: string;
  total: string | number;
  percentage: number | string;
}

export interface GetOrderModal {
  limit: number;
  filter?: keyof Order;
  sort?: "asc" | "desc";
  firstVisibleDoc?: any | null;
  lastVisibleDoc?: any | null;
  direction?: "prev" | "next";
  status?:
    | "Recieved"
    | "Canceled"
    | "Preparing"
    | "Received"
    | "Pending"
    | "Delivered";
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

export interface OrderModal {
  id?: string;
  name: string;
  products?: string[];
  rank?: string;
  orderRequest: string;
  status?: "pending" | "preparing" | "prepared" | "completed" | "cancelled";
  orderFullfilled: string;
}

export interface status {
  status?: "pending" | "preparing" | "prepared" | "completed" | "cancelled";
}
