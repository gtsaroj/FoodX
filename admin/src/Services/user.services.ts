import toast from "react-hot-toast";
import { makeRequest } from "../makeRequest";
import { addLogs } from "./log.services";
import {
  signInUser,
  signOutUser,
  signUpNewUser,
} from "../firebase/Authentication";
import { authLogout } from "../Reducer/user.reducer";
import { globalRequest } from "../GlobalRequest";
import { User, UserRole, GetUserModal, Register } from "../models/user.model";
import { getRoleFromAccessToken } from "../Utility/jwt.util";
import Cookies from "js-cookie";
import { Store } from "../Store";

export const searchUser = async (search: string) => {
  try {
    const response = await makeRequest({
      method: "get",
      url: `users/find?search=${search}`,
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to get users while searching" + error);
  }
};

export const signIn = async (
  email: string,
  password?: string,
  userRole: string = "admin"
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
    responseData.user.role = await role;
    const user = responseData.user as User;
    await addLogs({
      action: "login",
      date: new Date(),
      detail: `${user.fullName} was logged in ${new Date()} `,
      userId: user.uid,
      userRole: user.role as UserRole["role"],
    });
    toast.dismiss(toastLoader);
    toast.success(response.data.message);
    return user;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Invalid email or password");

    throw new Error("Error while login -> " + error);
  } finally {
    toast.dismiss(toastLoader);
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
    await addLogs({
      action: "register",
      date: new Date(),
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

export const updateUser = async (data: {
  id: string;
  role: "customer" | "admin" | "chef";
  field: string;
  newData: string;
}) => {
  try {
    const response = await makeRequest({
      method: "put",
      url: "/users/update-user",
      data: { id: data.id, role: data.role, [data.field]: data.newData },
    });
    return response.data.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
    throw new Error("Error while updating user " + error);
  }
};
export const deletUser = async (data: { uid: string; role: string }) => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "users/delete-user",
      data: { ...data },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to delete user" + error);
  }
};

export const signOut = async () => {
  const toastLoader = toast.loading("User logout...");
  try {
    await makeRequest({
      method: "post",
      url: "users/logout",
    });
    await addLogs({ action: "logout", date: new Date() });
    await signOutUser();
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Store.dispatch(authLogout());
    toast.dismiss(toastLoader);
    toast.success("User successfully logout");
  } catch (error) {
    toast.error("Error while logout user");
    throw new Error("Error while logging out user ->" + error);
  }
};

export const bulkDeleteOfCustomer = async (data: {
  role: string;
  ids: string[];
}) => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "users/bulk-delete",
      data: { role: data.role, ids: [...data.ids] },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to bulk delete" + error);
  }
};

export const deleteAllUser = async (users: User[]) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "users/delete-all",
      data: [...users],
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error while getting order by userId : ${error}`);
  }
};
export const deleteUser = async (data: { id: string; role: string }) => {
  try {
    const response = await makeRequest({
      method: "post",
      data: {
        uid: data.id,
        role: data.role,
      },
      url: "users/delete",
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to delete user" + error);
  }
};
//update role
export const updateRole = async (data: {
  id: string;
  role: string;
  newRole: string;
}) => {
  try {
    const response = await makeRequest({
      method: "put",
      url: "users/update-role",
      data: {
        id: data.id,
        role: data.role,
        newRole: data.newRole,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to update user role" + error);
  }
};

//get users
export const getUsers = async (data: GetUserModal) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "users/get-users",
      data: { ...data },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while getting users" + error);
  }
};

// get user by role & uid
export const getUser = async (role: UserRole, userId: string) => {
  try {
    const response = await makeRequest({
      method: "get",
      url: `users/${role.role}`,
      params: {
        userId: userId,
      },
    });
    return response;
  } catch (error) {
    return null;
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
    await addLogs({
      action: "update",
      date: new Date(),
      detail: `${
        response.data.data.updatedUser.fullName
      } updated  at ${new Date().toLocaleString()}`,
      userId: response.data.data.updatedUser.uid,
      userRole: response.data.data.updatedUser.role,
    });

    return response.data.data.updatedUser;
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
