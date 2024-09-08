export interface Banner {
  id: string;
  title: string;
  image: string;
  date: Date;
}

export interface BannerInfo extends Banner {
  createdAt: any;
  updatedAt: any;
}
