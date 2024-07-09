export interface RequestTime {
  _seconds: number;
  _nanoseconds: number;
}
export interface Order {
  orderId: string;
  uid: string;
  products: Product[] | string[];
  orderRequest: RequestTime;
  orderFullFilled: RequestTime;
}

// import { ProductType } from "./productMode";

export interface Product {
  id?: string
  name: string;
  quantity: number | string;
  price: number | string;
  image: string | any;
  tag: Category["types"] | undefined;
}

export interface Banner {
  img: string;
}

// export interface Order {
//   orderId: string;
//   customer: string;
//   products: ProductType[];
//   orderRequest: string;
//   orderFullFilled: string;
//   status: OrderStatus["types"];
// }

// interface OrderStatus {
//   types: "Recieved" | "Preparing" | "Completed" | "Canceled";
// }

interface Category {
  types: "pizza" | "momo" | "burger" | "cold drinks" | "hot drinks";
}

// export interface OrderHistoryCard {
//   name: string;
//   date: Date;
//   price: number;
//   quantity: number;
//   image: string;
// }

export interface DailyAggregateData {
  title: string;
  total: string | number;
  percentage: number | string;
}

export interface DailyCategoryAgrregateData {
  label: string;
  value: string | number;
}

export interface BarChartDataTypes {
  items: { [key: string]: string | number }[];
  week: string;
}
