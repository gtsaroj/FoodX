import { Product } from "./product.model.js";

export interface Order {
  orderId: string;
  uid: string;
  products: Product[];
  status: OrderStatus;
  orderRequest: string;
  orderFullFilled: string;
}

type OrderStatus = "fullfilled" | "cancelled" | "preparing" | "received" ; 