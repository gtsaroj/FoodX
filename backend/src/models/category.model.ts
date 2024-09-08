export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface CategoryInfo extends Category {
  createdAt: any;
  updatedAt: any;
}
