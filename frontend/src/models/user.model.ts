export interface authState {
  loading: boolean;
  userInfo: User;
  error: any;
  success: boolean;
}
export interface User {
  uid?: string;
  avatar?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRole;
  refreshToken?: string;
}

export interface UserRole {
  role: "admin" | "chef" | "customer";
}

export interface ImageFolders {
  folder: "users" | "products" | "banners";
}

export interface UpdateProfileInfo {
  avatar?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
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
