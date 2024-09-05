import { makeRequest } from "../makeRequest";

export const getBanners = async () => {
  try {
    const response = await makeRequest({
      method: "get",
      url: "banners/get-banners",
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while getting banners" + error);
  }
};
