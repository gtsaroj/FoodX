import { Product } from "./product.model.js";

export interface Order {
  orderId: string;
  uid: string;
  products: Product[];
  orderRequest: string;
  orderFullFilled: string;
}
