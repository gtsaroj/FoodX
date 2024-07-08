import { UserInfo } from "firebase/auth";
import { globalRequest } from "./GlobalRequest";
import {
  signInUser,
  signOutUser,
  signUpNewUser,
} from "./firebase/Authentication";
import Cookies from "js-cookie";
import { getRoleFromAccessToken } from "./Utility/JWTUtility";
import toast from "react-hot-toast";
import { ValidationType } from "./models/user.model";
import { UpdateProfileInfo } from "./Pages/Admin/AdminProfile";
import { Store } from "./Reducer/Store";
import { authLogout } from "./Reducer/Action";
import { makeRequest } from "./makeRequest";
import { UseFetch } from "../../frontend/src/UseFetch";
import { UploadProductType } from "./models/productMode";

export const signIn = async (email: string, password?: string) => {
  try {
    await signInUser(email, password as string);
    const response = await globalRequest({
      method: "post",
      url: "users/login",
      data: { email },
    });
    const responseData = response.data.data;
    Cookies.set("accessToken", responseData.accessToken);
    Cookies.set("refreshToken", responseData.refreshToken);
    const role = await getRoleFromAccessToken();
    console.log(role);
    responseData.user.role = await role;
    console.log(responseData.user);
    return responseData.user as UserInfo;
  } catch (error) {
    toast.error("Invalid username or password");
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

export const updateUser = async (data: UpdateProfileInfo) => {
  try {
    const response = await globalRequest({
      method: "post",
      url: "/users/update-user",
      data: { ...data },
    });
    return response.data.data;
  } catch (error) {
    toast.error("Unable to update user");
    throw new Error("Unable to update user");
  }
};

export const signOut = async () => {
  try {
    await makeRequest({
      method: "post",
      url: "users/logout",
    });
    await signOutUser();
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Store.dispatch(authLogout());
    toast.success("User successfully logout");
  } catch (error) {
    throw new Error("Error while logging out user ->" + error);
  }
};

export const getOrders = async () => {
  try {
    const response = await makeRequest({
      method: "get",
      url: "orders/all-orders",
    });
    return response.data;
  } catch (error) {
    if (error === "You have not access, please login again...")
      Store.dispatch(authLogout());
    console.log(`Error while getting revenueperday : ${error}`);
  }
};
export const getBanners = async () => {
  try {
    const response = await globalRequest({
      method: "post",
      url: "users/register",
    });
    return response.data;
  } catch (error) {
    console.log(`Error while getting revenueperday : ${error}`);
  }
};

export const postProducts = async (data: any) => {
  try {
    const response = await globalRequest({
      method: "post",
      url: "users/register",
      data: { ...data },
    });
    return response.data;
  } catch (error) {
    console.log(`Error while adding Products : ${error}`);
  }
};
export const postBanners = async (data: any) => {
  try {
    const response = await globalRequest({
      method: "post",
      url: "users/register",
      data: { ...data },
    });
    return response.data;
  } catch (error) {
    console.log(`Error while adding banners : ${error}`);
  }
};
export const getProducts = async () => {
  try {
    const response = await makeRequest({
      method: "get",
      url: "products/all",
    });
    return response.data;
  } catch (error) {
    console.log(`Error while adding banners : ${error}`);
  }
};

export const addProducts = async (data: UploadProductType) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "products/add-product",
      data: { ...data },
    });
    return response.data;
  } catch (error) {
    console.log(`Error while adding banners : ${error}`);
  }
};

export const getOrderByUser = async (id: string) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "orders/user-order",
      data: { id: id },
    });
    return response.data;
  } catch (error) {
    if (error === "You have not access, please login again...")
      Store.dispatch(authLogout());
    console.log(`Error while getting order by userId : ${error}`);
  }
};
