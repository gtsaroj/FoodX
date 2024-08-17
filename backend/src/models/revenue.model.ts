import { Product } from "./product.model.js";

export interface Revenue {
  id: string;
  orders: Product[];
}

export interface OrderProp {
  orderRequest: Date;
  products: Product[];
}
