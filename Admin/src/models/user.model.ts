export interface ValidationType {
  avatar: any;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmpassword: string;
  role?: userRole;
}

export interface User {
  uid?: string;
  avatar?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  refreshToken?: string;
}

export enum userRole {
  admin = "admin",
  chef = "chef",
  customer = "customer",
}

export interface UserDeleteType {
  id: string[];
  role: string;
}

export interface CustomerType {
  id?: string;
  name: string;
  email: string;
  image?: string;
  amountSpent: string | number;
  totalOrder: string | number;
  role: string;
}

export interface TopCustomerType {
  ImageFolders: string;
  Name: string;
  Email: string;
  Image: string;
  Amountspent: string | number;
  Totalorder: string | number;
}
