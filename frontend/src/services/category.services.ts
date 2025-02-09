import { globalRequest } from "../globalRequest";

export const getCategories = async (): Promise<
  Api.Response<Ui.Category[]>
> => {
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
