import toast from "react-hot-toast";
import { globalRequest } from "../globalRequest";
import { signInUser, signUpNewUser } from "../firebase/Authentication";
import Cookies from "js-cookie";
import { makeRequest } from "../makeRequest";
import { addLogs } from "./log.services";
import dayjs from "dayjs";

export const signIn = async (
  email: string,
  password?: string,
  userRole = "customer"
): Promise<
  Api.Response<{
    accessToken: string;
    refreshToken: string;
    user: Auth.User;
  } | null>
> => {
  const toastLoader = toast.loading("Logging in, please wait...");
  try {
    await signInUser(email, password as string);

    const response = await globalRequest({
      method: "post",
      url: "users/login",
      data: { email, userRole },
    });

    const responseData = <
      Api.Response<{
        accessToken: string;
        refreshToken: string;
        user: Auth.User;
      }>
    >response.data;

    Cookies.set("accessToken", responseData.data.accessToken, {
      secure: true,
      sameSite: "strict",
    });
    Cookies.set("refreshToken", responseData.data.refreshToken, {
      secure: true,
      sameSite: "strict",
    });
    toast.dismiss(toastLoader);
    await addLogs({
      action: "login",
      date: dayjs().toISOString(),
      detail: `${
        responseData.data.user.fullName
      } logged in at ${new Date().toLocaleString()}`,
      userId: responseData.data.user.uid,
      userRole: responseData.data.user.role,
    });
    toast.success("Logged in successfully!");
    return responseData;
  } catch (error) {
    toast.dismiss(toastLoader);
    console.log(`Error : ${error}`);
    toast.error("Error logging in. Please try again.");
    throw new Error("Invalid username or password");
  }
};

export const verifyNewUser = async (
  otp: number,
  uid: string
): Promise<
  Api.Response<{
    data: Auth.User;
  } | null>
> => {
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
    await addLogs({
      action: "register",
      date: new Date().toISOString(),
      detail: `${
        user.userInfo.fullName
      } signed up at ${new Date().toLocaleString()}`,
      userId: user.userInfo.uid,
      userRole: user.userInfo.role,
    });

    return user.userInfo;
  } catch (error) {
    throw new Error("Error while verify user " + error);
  }
};

export const signUp = async (
  data: Auth.ValidationType
): Promise<Api.Response<Auth.User["uid"]>> => {
  try {
    await signUpNewUser(
      data.firstName,
      data.lastName,
      data.email as string,
      data.password,
      data.avatar as string
    );
    const response = await globalRequest({
      method: "post",
      url: "users/signIn",
      data: { ...data },
    });

    const ressponseData = response.data;
    localStorage.setItem("uid", ressponseData.data.uid);
    return ressponseData;
  } catch (error) {
    throw new Error("Unable to create new user");
  }
};

export const updateAccount = async (data: {
  avatar?: string;
  phoneNumber?: number;
  fullName?: string;
  email?: string;
}): Promise<
  Api.Response<{
    updatedUser: Auth.User;
  }>
> => {
  try {
    const response = await makeRequest({
      method: "post",
      data: { ...data },
      url: "users/update-account",
    });
    await addLogs({
      action: "update",
      date: new Date().toISOString(),
      detail: `${
        response.data.data.updatedUser.fullName
      } updated  at ${new Date().toLocaleString()}`,
      userId: response.data.data.updatedUser.uid,
      userRole: response.data.data.updatedUser.role,
    });

    return response.data;
  } catch (error) {
    throw new Error("Unable to update account" + error);
  }
};

export const deleteAccount = async (): Promise<Api.Response<null>> => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "users/delete-account",
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while delete account " + error);
  }
};
