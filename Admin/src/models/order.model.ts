// export interface Order {
//   orderId: string;
//   uid: string;
//   products: Product[];
//   orderRequest: RequestTime;
//   orderFullFilled: RequestTime;
// }
// interface RequestTime {
//   seconds: string | number,
//   nanoseconds : string | number
// }

export interface Product {
  name: string;
  quantity: number;
  price: number;
  image: string;
  tag: Category["types"];
}

export interface Banner {
  img: string;
}

export interface Order {
  orderId: string;
  customer: string;
  products: any[];
  orderRequest: string;
  orderFullFilled: string;
  status: OrderStatus["types"];
}

interface OrderStatus {
  types: "Recieved" | "Preparing" | "Completed" | "Canceled";
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
