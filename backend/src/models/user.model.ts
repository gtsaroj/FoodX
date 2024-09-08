export interface Login {
  email: string;
  password: string;
}
export interface Register extends Login {
  avatar: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface User {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  refreshToken: string;
  role: RoleType;
  totalOrders: number;
}

export interface UserInfo extends User {
  createdAt: any;
  updatedAt: any;
}
export interface AccessType {
  privilage: RoleType;
}

export interface DecodeToken {
  uid: string;
  email: string;
  role: RoleType;
  iat: number;
  exp: number;
}

export type RoleType = "customer" | "chef" | "admin";
