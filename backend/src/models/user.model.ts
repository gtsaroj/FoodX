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
  role: "customers" | "admins";
}

export interface AccessType {
  privilage: "admins" | "customers";
}

export interface DecodeToken {
  uid: string;
  email: string;
  iat: number;
  exp: number;
}
