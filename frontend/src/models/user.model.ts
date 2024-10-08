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
  role?: UserRole["role"];
  refreshToken?: string;
  totalOrder?: number;
  totalSpent?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRole {
  role: "admin" | "chef" | "customer";
}

export interface ImageFolders {
  folder: "users" | "products" | "banners";
}

export interface UpdateProfileInfo {
  avatar?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: number;
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

export interface Register {
  avatar: string | File;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmpassword?: string;
  role?: UserRole["role"];
}
