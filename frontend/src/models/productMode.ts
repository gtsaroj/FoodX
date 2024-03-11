

export interface ProductType {
  id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ProductsType {
  products: ProductType[];
}
