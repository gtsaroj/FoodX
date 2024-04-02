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

export interface Category {
  icons: Categories;
}

export interface Categories {
  burger: string;
  pizza: string;
  cold_drinks: string;
  hot_drinks: string;
  momo: string;
}
