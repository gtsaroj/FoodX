export interface Product{
  id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  tag?: string;
}

export interface ProductType {
  products : Product[]
}
