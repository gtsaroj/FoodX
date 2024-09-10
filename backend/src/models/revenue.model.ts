import { Product } from "./product.model.js";

export interface Revenue {
  id: string; // date only.. do not include time
  orders: Product[];
}

export interface OrderProp {
  orderRequest: Date;
  products: Product[];
}

export interface RevenueInfo extends Revenue {
  createdAt: any;
  updatedAt: any;
}