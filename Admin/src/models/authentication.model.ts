import { User } from "./user.model";

export interface LoginTypes {
  type: "email" | "password";
  id: string;
  name: string;
  icon: boolean;
}
//

export interface ImageFolders {
  folder: "users" | "products" | "banners" | "categories";
}

export interface authState {
  loading: boolean;
  userInfo: any[] | null | User;
  error: boolean;
  success: boolean;
}
