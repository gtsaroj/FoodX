import { globalRequest } from "../globalRequest";

export const getNormalProducts = async (): Promise<
  Api.Response<Ui.Product[]>
> => {
  try {
    const response = await globalRequest({
      method: "GET",
      url: "products/all",
    });
    return response.data;
  } catch (error) {
    throw new Error("Unable to get normal products");
  }
};

export const getSpecialProducts = async (): Promise<
  Api.Response<Ui.Product[]>
> => {
  try {
    const response = await globalRequest({
      method: "GET",
      url: "products/specials",
    });
    return response.data;
  } catch (error) {
    throw new Error("Unable to get normal products");
  }
};

export const getProductsByTag = async (
  data: string
): Promise<Api.Response<Ui.Product[]>> => {
  try {
    const response = await globalRequest({
      method: "get",
      url: `products/get-product-by-tag/${data}`,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while getting products by tag" + error);
  }
};

export const getPopularProducts = async (): Promise<
  Api.Response<Ui.Product[]>
> => {
  try {
    const response = await globalRequest({
      method: "get",
      url: "products/popular",
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while fetching popular products" + error);
  }
};
