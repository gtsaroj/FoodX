import { globalRequest } from "../globalRequest";

export const getBanners = async (
  path: "sponsors" | "banners"
): Promise<
  Api.Response<{
    banners: Ui.Banner[] | null;
    collection: Ui.BannerType; // TODO: rename to type
  }>
> => {
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
