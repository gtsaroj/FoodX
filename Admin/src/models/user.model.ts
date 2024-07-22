import { ImageFolders } from "./UserModels";
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

export enum userRole {
  admin = "admin",
  chef = "chef",
  customer = "customer",
}

export interface CustomerType {
  ID?: string;
  Name: string;
  Email: string;
  Image?: string;
  Location: string;
  Amountspent: string | number;
  Totalorder: string | number;
  Role: string;
}

export interface TopCustomerType {
  ImageFolders: string;
  Name: string;
  Email: string;
  Image: string;
  Amountspent: string | number;
  Totalorder: string | number;
}
