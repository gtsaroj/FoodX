export interface ProductType {
  id: string;
  image: string;
  name: string;
  price: number | string;
  quantity: number | string;
  tag?: string;
}
export interface ArrangedProduct {
  ID: string;
  Image: string;
  Name: string;
  Price: string;
  Quantity: string;
  Category: string;
}
export interface ProductTable {
  name: string;
  image: string;
  price: number;
  quantity: number;
  rating: number;
}
export interface UploadProductType {
  products: ProductType;
  collection: Collection["name"];
}

export interface Collection {
  name: "products" | "specials";
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
