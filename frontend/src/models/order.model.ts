import { Product } from "./product.model";

export interface Order {
  orderId?: string;
  uid: string;
  products: Product[];
  orderRequest: Date;
  orderFullFilled?: string;
  status?: string;
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

export interface UserOrder {
  id: string;
  products: string[];
  time: string; // Date formatted as MM/DD/YYYY
  status: string;
  amount: number;
  payment: "esewa" | "cash" | "credit_card" | "other"; // Enum-like for payment methods
}

