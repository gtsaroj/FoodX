import { LoginTypes } from "../../models/authentication.model";

export const LoginInputs: LoginTypes[] = [
  {
    id: "email",
    type: "email",
    name: "Email",
    icon: false,
  },
  {
    id: "password",
    type: "password",
    name: "Password",
    icon: true,
  },
  {
    id: "confirmPassword",
    type: "password",
    name: "Confirm Password",
    icon: true,
  },
];
