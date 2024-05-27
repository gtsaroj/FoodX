export interface authState {
  loading: boolean;
  userInfo: any;
  error: any;
  success: boolean;
}

export interface ImageFolders {
  folder: "users" | "products" | "banners";
}

export interface DbUser {
  avatar: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  refreshToken: string;
  uid: string;
  role?: "admin" | "customers";
}