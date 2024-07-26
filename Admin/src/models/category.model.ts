export interface CategoryType {
  id?: string;
  name: string;
  Category?: string;
  image?: string;
  item?: number,
  order: number,
  revenue: number,
  rank: number
}
export interface UpdateCategoryType {
  id: string;
  field: string;
  newData: string;
}
