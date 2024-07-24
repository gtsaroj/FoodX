import { Product } from "./product.model.js";

export interface Order {
  orderId: string;
  uid: string;
  products: Product[];
  status: OrderStatus;
  orderRequest: string;
  orderFullFilled: string;
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
