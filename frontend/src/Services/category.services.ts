import { globalRequest } from "../GlobalRequest";
import { makeRequest } from "../makeRequest";

export const getCategories = async () => {
  try {
    const response = await globalRequest({
      method: "GET",
      url: "categories/get-category",
    });
    return response.data;
  } catch (error) {
    throw new Error("Unable to get categories" + error);
  }
};
