export interface CategoryType {
  id?: string;
  name: string;
  image?: string;
  item?: number;
  order?: number;
  revenue?: number;
  rank?: number;
}
export interface UpdateCategoryType {
  id: string;
  field: string;
  newData: string;
}
export interface UpdateComponentType {
  category?: "specials" | "products";
  id: string;
  field: string;
  newData: string;
}
