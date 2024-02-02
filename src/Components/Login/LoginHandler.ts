import { LoginTypes } from "../../models/Authentication";

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
