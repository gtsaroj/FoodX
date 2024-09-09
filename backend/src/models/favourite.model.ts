export interface Favourite {
  uid: string;
  products: string[];
}

export interface FavouriteInfo extends Favourite {
  createdAt: any;
  updatedAt: any;
}
