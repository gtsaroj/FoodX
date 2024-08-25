export interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  order?: number;
  revenue?: number;
  rating?: number;
  quantity: number;
  tag?: string;
  type?: "products" | "specials";
}

export interface GetProductModal {
  page?: number;
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
export interface UploadProduct {
  products: Product;
  collection: Collection["name"];
}

export interface Collection {
  name: "products" | "specials";
}

export interface CardAnalytic {
  title: string;
  total: number;
  percentage: string;
}
