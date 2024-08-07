export interface ProductType {
  id: string;
  image: string;
  name: string;
  price: number | string;
  quantity: number | string;
  tag?: string;
}
export interface ArrangedProduct {
  id: string;
  image: string;
  name: string;
  price: number;
  order: number;
  revenue: number;
  rating: number;
  quantity: number;
  category?: string;
  type: "products" | "specials";
}

export interface ProductModel {
  id: string;
  name: string;
  item?: number;
  price: number;
  order?: number;
  revenue?: number;
  rank?: number;
  imageurl?: string;
}

export interface GetProductModal {
  path: "specials" | "products";
  pageSize: number;
  filter?: keyof ProductType;
  sort?: "asc" | "desc";
  direction?: "next" | "prev";
  currentFirstDoc?: string | null;
  currentLastDoc?: string | null;
}

export interface ProductBulkDeleteModal {
  id: string;
  category: string;
}
export interface ProductTable {
  name: string;
  image: string;
  price: number;
  quantity: number;
  rating?: number;
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
