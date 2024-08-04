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
import {
  CustomerType,
  UserDeleteType,
  ValidationType,
} from "./models/user.model";
import { UpdateProfileInfo } from "./Pages/Admin/AdminProfile";
import { Store } from "./Reducer/Store";
import { makeRequest } from "./makeRequest";

import {
  ProductBulkDeleteModal,
  ProductModel,
  UploadProductType,
} from "./models/productMode";
import { TicketType } from "./models/ticket.model";
import {
  CategoryType,
  UpdateCategoryType,
  UpdateComponentType,
} from "./models/category.model";
import { LogCardProps } from "./models/logModel";
import { updateComponentProp } from "./models/table.model";

export const signIn = async (
  email: string,
  password?: string,
  userRole: string = "admin"
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
    return response.data.data;
  } catch (error) {
    throw new Error(`Error while getting revenueperday : ${error}`);
  }
};

export const bulkDeleteOfCustomer = async (data: {
  role: string;
  ids: string[];
}) => {
  try {
    const response = await makeRequest({
      method: "delete",
      data: { role: data.role, ids: [...data.ids] },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to bulk delete" + error);
  }
};
export const deleteCustomer = async (data: { role: string; id: string }) => {
  try {
    return toast.error("No route found");
  } catch (error) {
    throw new Error("Unable to delete user" + error);
  }
};

export const postProducts = async (data: any) => {
  try {
    const response = await makeRequest({
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
    const response = await makeRequest({
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
export const getSpecialProducts = async () => {
  try {
    const response = await makeRequest({
      method: "get",
      url: "products/specials",
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
    if (error === "You have not access, please login again...")
      Store.dispatch(authLogout());
    console.log(`Error while adding banners : ${error}`);
  }
};
export const updateProduct = async (data: UpdateComponentType) => {
  try {
    const response = await makeRequest({
      method: "put",
      url: "products/update-product",
      data: {
        category: data.category,
        id: data.id,
        field: data.field,
        newData: data.newData,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error while updating food : ${error}`);
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

export const deleteAllUser = async (users: CustomerType[]) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "users/delete-all",
      data: [...users],
    });
    return response.data;
  } catch (error) {
    if (error === "You have not access, please login again...")
      Store.dispatch(authLogout());
    throw new Error(`Error while getting order by userId : ${error}`);
  }
};

export const createTicket = async (data: TicketType) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "tickets/add-ticket",
      data: data,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error while creating ticket` + error);
  }
};

export const getTicketByStatus = async (status: string) => {
  let request = 5;
  console.log(request);
  if (request < 0) return console.log("Time finished");
  try {
    request = -1;
    const response = await makeRequest({
      method: "post",
      url: "tickets/get-ticket-status",
      data: { status: status },
    });
    return response.data.data;
  } catch (error) {
    return console.log(`Error while creating ticket` + error);
  }
};

export const deleteTicket = async (data: TicketType) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "tickets/delete-ticket",
      data: data,
    });
    return response.data;
  } catch (error) {
    return console.log(`Error while creating ticket` + error);
  }
};

export const updateTicket = async (data: TicketType) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "tickets/update-ticket",
      data: data,
    });
    return response.data;
  } catch (error) {
    return console.log(`Error while creating ticket` + error);
  }
};

// categories
export const addCategory = async (data: { image: string; name: string }) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "categories/add-category",
      data: { name: data.name, image: data.image },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to add new category" + error);
  }
};
export const updateCategory = async (data: UpdateCategoryType) => {
  try {
    const response = await makeRequest({
      method: "put",
      url: "categories/update-category",
      data: { id: data.id, field: data.field, newData: data.newData },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to update exist category" + error);
  }
};
export const deleteCategory = async (id: string) => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "categories/delete-category",
      data: { id },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to delete exist category" + error);
  }
};
export const getCategories = async (): Promise<CategoryType[]> => {
  try {
    const response = await makeRequest({
      method: "get",
      url: "categories/get-category",
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to fetch  categories" + error);
  }
};
export const bulkDeleteOfCategory = async (id: string[]) => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "categories/bulk-delete",
      data: { ids: [...id] },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to delete categories");
  }
};

// log
export const getRoleLogs = async () => {
  try {
    const response = await makeRequest({
      method: "get",
      url: "logs/get-role-logs",
    });
    return response.data;
  } catch (error) {
    throw new Error("Unable to fetch role logs" + error);
  }
};

export const getActionLogs = async () => {
  try {
    const response = await makeRequest({
      method: "get",
      url: "logs/get-action-logs",
    });
    return response.data;
  } catch (error) {
    throw new Error("Unable to fetch action logs" + error);
  }
};
export const addLogs = async (data: LogCardProps) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "logs/add-logs",
      data: { ...data },
    });
    return response.data;
  } catch (error) {
    throw new Error("Unable to fetch action logs" + error);
  }
};

export const deleteUser = async (data: UserDeleteType) => {
  try {
    const response = await makeRequest({
      method: "post",
      data: {
        ids: data.id,
        role: data.role,
      },
      url: "users/delete",
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to delete user" + error);
  }
};
// product
export const bulkDeleteOfProduct = async (data: {
  ids: string[];
  category: "products" | "specials";
}) => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "products/bulk-delete",
      data: { category: data.category, ids: [...data.ids] },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to delete categories");
  }
};

export const updateOrderStatus = async (data: {
  id: string;
  status: string;
}) => {
  try {
    const response = await makeRequest({
      method: "put",
      data: { id: data.id, status: data.status },
      url: "orders/update-order",
    });
    return response.data.data;
  } catch (error) {
    throw new Error("unable to update order status" + error);
  }
};

// banner
export const addBanner = async (data: { name: string; img: string }) => {
  try {
    const response = await makeRequest({
      method: "post",
      data: { title: data.name, image: data.img },
      url: "banners/add-banner",
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to add banners" + error);
  }
};

export const getBanners = async () => {
  try {
    const response = await makeRequest({
      method: "get",
      url: "banners/get-banners",
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to fetch banners" + error);
  }
};

export const bulkDeleteBanner = async (data: { id: string[] }) => {
  try {
    const response = await makeRequest({
      method: "delete",
      data: { ids: [...data.id] },
      url: "banners/bulk-delete",
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to delete banner" + error);
  }
};
export const deleteBanner = async (data: { id: string }) => {
  try {
    const response = await makeRequest({
      method: "delete",
      data: { id: data.id },
      url: "banners/delete-banner",
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to delete banners" + error);
  }
};

//update role
export const updateRole = async (data: { id: string; role: string }) => {
  try {
    const response = await makeRequest({
      method: "put",
      url: "users/update-role",
      data: { id: data.id, newRole: data.role },
    });
    console.log(response);
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to update user role" + error);
  }
};
