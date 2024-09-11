import { makeRequest } from "../makeRequest";

export const getFavourites = async (uid: string) => {
  try {
    const response = await makeRequest({
      method: "get",
      url: `favourites/${uid}`,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while fetching favourites" + error);
  }
};
export const removeFavourites = async (data:{uid: string, productId: string}) => {
  try {
    const response = await makeRequest({
      method: "delete",
      data: { ...data },
      url: `favourites/remove`,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while deleting favourites" + error);
  }
};

export const addFavourite = async (data:{uid: string, productId: string}) => {
  try {
    const response = await makeRequest({
      method: "post",
      data: { ...data },
      url: `favourites/add`,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while deleting favourites" + error);
  }
};
