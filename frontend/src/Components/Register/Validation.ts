export interface errorValidationObject {
  avatar: string;
  firstname: string | number;
  lastname: string | number;
  email: string | number;
  password: string | number;
  confirmpassword: string;
}

export enum Role {
  customer = "customor",
  admin = "admin",
}
