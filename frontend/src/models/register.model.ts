export interface ValidationType {
  avatar: any;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmpassword: string;
  role?: UserRole["role"];
}

export interface UserRole {
  readonly role: "admin" | "chef" | "customer";
}
