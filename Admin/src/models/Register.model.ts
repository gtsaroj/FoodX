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
