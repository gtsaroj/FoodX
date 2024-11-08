export interface BannerModel {
  id: string;
  title: string;
  image: string;
  date?: string;
  path?: "sponsors" | "banners" | string;
}
export interface Banner extends Omit<BannerModel, "date"> {
  date: { _seconds: number; _nanoseconds: number };
}
