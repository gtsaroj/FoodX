export interface Order {
  orderId?: string;
  uid: string;
  products: Product[];
  orderRequest: RequestTime | string;
  orderFullFilled?: RequestTime | string;
  status? : string;
}
interface RequestTime {
  seconds: string | number,
  nanoseconds : string | number
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  tag: Category["types"];
}

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
