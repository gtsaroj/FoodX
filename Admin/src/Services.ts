import { globalRequest } from "./GlobalRequest";

export const LoginService = async () => {
  try {
    const response = await globalRequest({
      method: "post",
      url: "users/login",
    });

    return response.data;
  } catch (error) {
    console.log(`Error while Loging : ${error}`);
  }
};
export const SignUpService = async () => {
  try {
    const response = await globalRequest({
      method: "post",
      url: "users/register",
    });
    return response.data;
  } catch (error) {
    console.log(`Error while SignUp : ${error}`);
  }
};
export const getOrders = async () => {
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
    const response = await globalRequest({
      method: "get",
      url: "users/register",
    });
    return response.data;
  } catch (error) {
    console.log(`Error while adding banners : ${error}`);
  }
};
