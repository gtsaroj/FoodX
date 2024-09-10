import { makeRequest } from "../makeRequest";

export const getBanners = async (path: "sponsors" | "banners") => {
  try {
    const response = await makeRequest({
      method: "get",

      url: `banners/${path}`,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while getting banners" + error);
  }
};
