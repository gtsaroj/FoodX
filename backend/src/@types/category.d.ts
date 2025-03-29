declare namespace Category {
  interface CategoryData {
    id: string;
    name: string;
    image: string;
    bannerImage: string;
    description?: string;
  }

  interface CategoryInfo extends CategoryData {
    createdAt: any;
    updatedAt: any;
  }
}
