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

export interface FetchModal {
  currentFirstDoc: string;
  currentLastDoc: string;
  users: User[];
  length: number;
}

export interface GetUserModal {
  path: "customer" | "admin" | "chef";
  pageSize: number;
  filter?: keyof User;
  sort: "asc" | "desc";
  direction: "prev" | "next";
  currentFirstDoc?: any | null;
  currentLastDoc?: any | null;
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

export interface User {
  id?: string;
  uid?: string;
  avatar?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: number;
  role?: UserRole["role"];
  totalSpent?: number;
  totalOrder?: number;
  refreshToken?: string;
}

export interface DeleteUser {
  id: string[];
  role: string;
}

export interface UserRole {
  readonly role: "admin" | "chef" | "customer";
}
