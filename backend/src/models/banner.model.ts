export interface Banner {
  id: string;
  title: string;
  image: string;
  date: Date;
  link?: string;
}

export interface BannerInfo extends Banner {
  createdAt: any;
  updatedAt: any;
}
