import { makeRequest } from "../makeRequest";

export const getNormalProducts = async () => {
  try {
    const response = await makeRequest({
      method: "GET",
      url: "products/all",
    });
    return response.data;
  } catch (error) {
    throw new Error("Unable to get normal products");
  }
};
export const getSpecialProducts = async () => {
  try {
    const response = await makeRequest({
      method: "GET",
      url: "products/specials",
    });
    return response.data;
  } catch (error) {
    throw new Error("Unable to get normal products");
  }
};

