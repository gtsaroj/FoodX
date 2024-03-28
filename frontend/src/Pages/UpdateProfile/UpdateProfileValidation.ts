import { Key } from "lucide-react";
import { UpdateProfileType } from "../UpdateProfile/UpdateProfile";

export const allFieldsRequired = (
  RegisterValue: UpdateProfileType,
  error: Record<string, string>
) => {
  for (const inputValue in RegisterValue) {
    if (
      RegisterValue.hasOwnProperty(inputValue) &&
      RegisterValue[inputValue as keyof UpdateProfileType] === ""
    )
      error[inputValue] = `All are required`;
  }

  if (Object.keys(error).length !== 0) {
    return error;
  }
};

export const checkValidNumber = (
  registervalue: UpdateProfileType,
  error: Record<string, string>
) => {
  if (registervalue.phoneNumber.length < 10) {
    return (error.number = "Invalid Number");
  }
};
