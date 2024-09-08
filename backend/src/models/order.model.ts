import { Product } from "./product.model.js";

export interface Order {
  orderId: string;
  uid: string;
  products: Product[];
  status: OrderStatus;
  note: string;
  orderRequest: any;
  orderFullFilled: any;
}

export interface GetOrderModal {
  pageSize: number;
  filter: keyof Order;
  sort: "asc" | "desc";
  currentFirstDoc?: any | null;
  currentLastDoc?: any | null;
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

export type OrderStatus = "fullfilled" | "cancelled" | "preparing" | "received";

export interface OrderInfo extends Order {
  createdAt: any;
  updatedAt: any;
}
