export interface Cart {
  uid: string;
  products: string[];
}

export interface CartInfo extends Cart {
  createdAt: any;
  updatedAt: any;
}
