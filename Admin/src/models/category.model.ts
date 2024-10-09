export interface Category {
  id: string;
  name: string;
  image: string;
  item: number;
  order: number;
  revenue: number;
  rank: number;
}
export interface UpdateCategory {
  category?: "specials" | "products";
  id: string;
  field: string;
  newData: string;
}
