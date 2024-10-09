import { globalRequest } from "../GlobalRequest";

export const getBanners = async (path: "sponsors" | "banners") => {
  try {
    const response = await globalRequest({
      method: "get",

      url: `banners/${path}`,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while getting banners" + error);
  }
};
