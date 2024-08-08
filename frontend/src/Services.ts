import toast from "react-hot-toast";
import { globalRequest } from "./GlobalRequest";
import { UpdateProfileInfo } from "./Pages/UpdateProfile/ProfileSection";
import { signInUser, signUpNewUser } from "./firebase/Authentication";
import { ValidationType } from "./models/Register.model";
import Cookies from "js-cookie";
import { getRoleFromAccessToken } from "./Utility/JWTUtility";
import { Order } from "./models/order.model";
import { makeRequest } from "./makeRequest";
import { waitForPendingWrites } from "firebase/firestore";

interface userInfo {
  uid: string;
  email: string;
  fullName: string;
  avatar: string;
  refreshToken: string;
  role: string;
}

export const signIn = async (
  email: string,
  password?: string,
  userRole = "customer"
) => {
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
    console.log(responseData.user);
    return responseData.user as userInfo;
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

// export const signOut = async () => {

//   try {
//     const response = await makeRequest({
//       url: "users/logout",
//     });
//     console.log(response);
//     await signOutUser()
//     if (response.status === 200) {
//       Store.dispatch(authLogout())
//     }

//     Cookies.remove("accessToken");
//     Cookies.remove("refreshToken");
//   } catch (error) {
//     toast.error("Unable to log out user");
//     throw new Error(`Unable to log out user -> ${error}`);
//   }
// };

export const order = async (data: Order) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "/orders/add-order",
      data: { ...data },
    });
    console.log(response.statusText);
    return response.data.data;
  } catch (error) {
    toast.error("Unable to update user");
    throw new Error("Unable to update user");
  }
};

export const getAllCategory = async () => {
  try {
    const response = await makeRequest({
      method: "get",
      url: "categories/get-category",
    });
  return response.data.data
  } catch (error) {
    throw new Error("Error while fetching data" + error);
  }
};
