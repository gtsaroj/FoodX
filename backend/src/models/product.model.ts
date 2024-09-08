export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  tagId: string;
  totalSold: number;
}
export interface UploadProductType {
  product: Product;
  collection: Collection["name"];
}

export interface Collection {
  name: "products" | "specials";
}

export interface SearchResult extends Product {
  type: string;
}

export interface ProductInfo extends Product {
  createdAt: any;
  updatedAt: any;
}
