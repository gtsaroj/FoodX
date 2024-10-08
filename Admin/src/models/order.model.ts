import { Product } from "./product.model";

export interface Order {
  orderId: string;
  name?: string;
  uid?: string;
  products: Product[];
  rank?: number;
  note?: string;
  orderRequest: string;
  status?: "pending" | "preparing" | "prepared" | "completed" | "cancelled";
  orderFullfilled?: string;
  updatedAt?: Date;
}

export interface RecentOrder extends Order {
  image: string;
  price: number;
  products: string[] | Product[];
}

export interface DailyAggregateData {
  title: string;
  total: string | number;
  percentage: number | string;
}

export interface GetOrderModal {
  pageSize: number;
  filter?: keyof Order;
  sort?: "asc" | "desc";
  currentFirstDoc?: any | null;
  currentLastDoc?: any | null;
  direction?: "prev" | "next";
  status?: "pending" | "preparing" | "prepared" | "completed" | "cancelled";
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
  uid?: string;
  id?: string;
  name: string;
  products?: Product[];
  rank?: number;
  orderRequest: string;
  status: "pending" | "preparing" | "prepared" | "completed" | "cancelled";
  orderFullfilled: string;
}

export interface status {
  status?: "pending" | "preparing" | "prepared" | "completed" | "cancelled";
}
