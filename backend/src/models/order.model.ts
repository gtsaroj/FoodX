import { Product } from "./product.model.js";

export interface Order {
  uid: string;
  products: Product[];
  orderRequest: string;
  orderFullFilled: string;
}
