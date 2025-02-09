declare namespace Ui {
  interface Product {
    id: string;
    image: string;
    name: string;
    price: number;
    quantity: number;
    tag?: string;
    tagId?: string;
    totalSold?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  type BannerType = "banners" | "sponsors";
  interface Banner {
    id: string;
    title: string;
    image: string;
    link: string;
    date?: Date | string;
    createdAt?: string;
    updatedAt?: string;
  }
  interface Category {
    id: string; //pk
    name: string;
    image: string;
    createdAt?: Common.TimeStamp;
    updatedAt?: Common.TimeStamp;
  }
  interface SlideProp {
    url: string;
  }

  interface Slides {
    slides: SlideProp[];
  }

  export interface Favourite {
    id: string; //pk
    uid: string;
    products?: Product[];
    createdAt?: Date;
    updatedAt?: Date;
  }
}
