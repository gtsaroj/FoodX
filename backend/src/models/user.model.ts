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
}

export interface AccessType {
  privilage: "admins" | "customers";
}
