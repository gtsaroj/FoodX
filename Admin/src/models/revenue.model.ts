import { Product } from "./product.model";

export interface AddRevenue {
  startDate: string;
  endDate?: string;
}

export interface Revenue {
  id: string;
  orders: Product[];
}
export interface RevenueInfo extends Revenue {
  createdAt: any;
  updatedAt: any;
}