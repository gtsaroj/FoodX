import { makeRequest } from "../makeRequest";

export const addProductToCart = async (uid: string, productId: string) => {
  try {
    const response = await makeRequest({
      method: "post",
      data: { uid, productId },
      url: "cart/add",
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Error while adding product in cart" + error);
  }
};

export const removeProductFromCart = async (uid: string, productId: string) => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "/cart/remove",
      data: { uid, productId },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Error while remove product from cart " + error);
  }
};

export const getProductsOfCart = async (uid: string) => {
  try {
    const response = await makeRequest({
      method: "get",
      url: `cart/${uid}`,
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch cart products. Please try again."+error);
  }
};
