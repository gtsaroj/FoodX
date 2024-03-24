export interface ProductType {
  id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  tag?: string;
}

export interface ProductsType {
  products: ProductType[];
}
