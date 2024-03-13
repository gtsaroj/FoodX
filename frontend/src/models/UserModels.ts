export interface authState {
  loading: boolean;
  userInfo: any;
  error: any;
  success: boolean;
}

export interface ImageFolders {
  folder: "users" | "products" | "banners";
}
