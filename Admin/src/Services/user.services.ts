import { makeRequest } from "../makeRequest";

export const searchUser = async (search: string) => {
  try {
    const response = await makeRequest({
      method: "get",
      url: `users/all?search=${search}`,
    });
    return response.data.data.products;
  } catch (error) {
    throw new Error("Unable to get users while searching" + error);
  }
};
