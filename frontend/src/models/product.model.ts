export interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  tag?: string;
  tagId?: string;
  totalSold?: number,
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductType {
  products: Product[];
}
