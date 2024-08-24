export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  tag: string;
}
export interface UploadProductType {
  products: Product;
  collection: Collection["name"];
}

export interface Collection {
  name: "products" | "specials";
}

export interface SearchResult extends Product {
  type: string;
}