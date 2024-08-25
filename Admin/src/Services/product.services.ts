import { makeRequest } from "../makeRequest";

export const searchProduct = async (search: string) => {
  try {
    const response = await makeRequest({
      method: "get",
      url: `products/all?search=${search}`,
    });
    return response.data.data.products;
  } catch (error) {
    throw new Error("Unable to get products while searching" + error);
  }
};
