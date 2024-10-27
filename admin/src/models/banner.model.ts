export interface BannerModel {
  id: string;
  title: string;
  image: string;
  date?: { _seconds: number; _nanoseconds: number };
  path?: "sponsors" | "banners" | string;
}
