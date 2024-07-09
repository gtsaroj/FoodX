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
  id: string;
  name: string;
  email: string;
  location: string;
  amountSpent: string | number;
  totalOrder: string | number;
  role: string;
}
