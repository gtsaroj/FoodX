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
  role?: UserRole;
  refreshToken?: string;
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
  amountSpent: number;
  totalOrder: number;
  role: string;
}



export interface UserRole {
  readonly role: "admin" | "chef" | "customer";
}
