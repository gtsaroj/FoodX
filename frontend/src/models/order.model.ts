import { Product } from "./product.model";

export interface Order {
  orderId?: string;
  uid: string;
  products: Product[];
  orderRequest: string;
  orderFullFilled?: string;
  status?: OrderStatus["status"];
  updateAt?: string;
  note?: string;
}
export interface GetOrderModal {
  pageSize: number;
  filter: keyof Order;
  sort: "asc" | "desc";
  currentFirstDoc?: any | null;
  currentLastDoc?: any | null;
  direction?: "prev" | "next";
  status?: "pending" | "preparing" | "prepared" | "completed" | "cancelled";
  userId?: string;
}

export interface OrderStatus{
  status: "pending" | "preparing" | "prepared" | "completed" | "cancelled";
}

export interface UserOrder {
  productImage?: string;
  id: string;
  products: string[];
  time: string; // Date formatted as MM/DD/YYYY
  status: string;
  amount: number;
  payment: "esewa" | "cash" | "credit_card" | "other"; // Enum-like for payment methods
}
