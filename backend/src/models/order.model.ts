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

export type OrderStatus =
  | "pending"
  | "preparing"
  | "prepared"
  | "completed"
  | "cancelled";

export interface OrderInfo extends Order {
  createdAt: any;
  updatedAt: any;
}
