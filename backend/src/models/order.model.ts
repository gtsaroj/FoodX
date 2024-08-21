import { Product } from "./product.model.js";

export interface Order {
  orderId: string;
  uid: string;
  products: Product[];
  status: OrderStatus;
  orderRequest: string;
  orderFullFilled: string;
}

export interface GetOrderModal {
  pageSize: number;
  filter: keyof Order;
  sort: "asc" | "desc";
  currentFirstDoc?: any | null;
  currentLastDoc?: any | null;
  direction?: "prev" | "next";
  status?: "Recieved" | "Canceled" | "Preparing" | "Received" |"Pending"|"Delivered";
  userId?: string;
}

export type OrderStatus = "fullfilled" | "cancelled" | "preparing" | "received";

export interface CustomerType {
  id: string;
  name: string;
  email: string;
  location: string;
  amountSpent: string | number;
  totalOrder: string | number;
  role: string;
}
