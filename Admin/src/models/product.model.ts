export interface Product {
  id: string;
  image: string;
  name: string;
  price: number | string;
  order?: number;
  revenue?: number;
  rating?: number;
  quantity: number | string;
  tag?: string;
  tagId?: string;
  category?: string;
  type?: "products" | "specials";
}

export interface GetProductModal {
  page?: number;
  path: "specials" | "products";
  pageSize: number;
  filter?: keyof Product;
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
  product: Product;
  collection: Collection["name"];
}

export interface Collection {
  name: "products" | "specials";
}

export interface CardAnalytic {
  title: string;
  total: number;
  percentage: number | string;
}
