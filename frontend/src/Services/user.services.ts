import toast from "react-hot-toast";
import { globalRequest } from "../GlobalRequest";
import { getRoleFromAccessToken } from "../Utility/JWTUtility";
import { signInUser, signUpNewUser } from "../firebase/Authentication";
import { ValidationType } from "../models/register.model";
import { Register, User } from "../models/user.model";
import Cookies from "js-cookie";
import { makeRequest } from "../makeRequest";
import { addLogs } from "./log.services";

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
    await addLogs({
      action: "login",
      date: new Date(),
      detail: `${responseData.userInfo.fullName} loggedin at ${new Date()} `,
      userId: responseData.userInfo.uid,
      userRole: responseData.userInfo.role,
    });
    return responseData.user as User;
  } catch (error) {
    toast.dismiss(toastLoader);
    toast.error("Error logging in. Please try again.");
    throw new Error("Invalid username or password");
  }
};

export const verifyNewUser = async (otp: number, uid: string) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "otp/verify",
      data: { code: otp, uid: uid },
    });
    toast.success("Congratulations! You logged in");
    const user = response.data.data;
    Cookies.set("accessToken", user.accessToken);
    Cookies.set("refreshToken", user.refreshToken);
    localStorage.removeItem("time");
    localStorage.removeItem("uid");
    return user.userInfo;
  } catch (error) {
    throw new Error("Error while verify user " + error);
  }
};

export const signUp = async (data: Register) => {
  try {
    await signUpNewUser(
      data.firstName,
      data.lastName,
      data.email,
      data.password,
      data.avatar as string
    );
    const response = await globalRequest({
      method: "post",
      url: "users/signIn",
      data: { ...data },
    });

    const ressponseData = response.data.data;
    localStorage.setItem("uid", ressponseData || ressponseData.uid);
    return;
  } catch (error) {
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
