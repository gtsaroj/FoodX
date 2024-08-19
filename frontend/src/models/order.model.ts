export interface Order {
  orderId?: string;
  uid: string;
  products: Product[];
  orderRequest: RequestTime | string;
  orderFullFilled?: RequestTime | string;
  status?: string;
}



