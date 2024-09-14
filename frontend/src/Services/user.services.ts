import toast from "react-hot-toast";
import { globalRequest } from "../GlobalRequest";
import { getRoleFromAccessToken } from "../Utility/JWTUtility";
import { signInUser, signUpNewUser } from "../firebase/Authentication";
import { ValidationType } from "../models/register.model";
import { User } from "../models/user.model";
import Cookies from "js-cookie";
import { makeRequest } from "../makeRequest";

export const signIn = async (
  email: string,
  password?: string,
  userRole = "customer"
) => {
  const toastLoader = toast.loading("Logging in, please wait...");
  try {
    await signInUser(email, password as string);
    const response = await globalRequest({
      method: "post",
      url: "users/login",
      data: { email, userRole },
    });
    const responseData = response.data.data;
    Cookies.set("accessToken", responseData.accessToken);
    Cookies.set("refreshToken", responseData.refreshToken);
    const role = await getRoleFromAccessToken();
    responseData.user.role = role;
    toast.dismiss(toastLoader);
    toast.success("Logged in successfully!");

    return responseData.user as User;
  } catch (error) {
    toast.dismiss(toastLoader);
    toast.error("Error logging in. Please try again.");
    throw new Error("Invalid username or password");
  }
};

export const signUp = async (data: ValidationType) => {
  try {
    await signUpNewUser(
      data.firstName,
      data.lastName,
      data.email,
      data.password,
      data.avatar
    );
    const response = await globalRequest({
      method: "post",
      url: "users/signIn",
      data: { ...data },
    });
    await signIn(data.email, data.password);
    return response.data.data.userInfo;
    // return response.data.data.userInfo;
  } catch (error) {
    console.log(error);
    // toast.error("Unable to create new user");
    throw new Error("Unable to create new user");
  }
};

export const updateAccount = async (data: {
  avatar?: string;
  phoneNumber?: number;
  fullName?: string;
  email?: string;
}) => {
  try {
    const response = await makeRequest({
      method: "post",
      data: { ...data },
      url: "users/update-account",
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to update account" + error);
  }
};

export const deleteAccount = async () => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "users/delete-account",
    });
    return response.status;
  } catch (error) {
    throw new Error("Error while delete account " + error);
  }
};
