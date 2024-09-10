import { Product } from "./product.model";

export interface Favourite {
  id: string; //pk
  uid: string;
  products?: Product[];
  createdAt?: Date;
  updatedAt?: Date;
}
