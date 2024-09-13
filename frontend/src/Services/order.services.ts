import toast from "react-hot-toast";
import { makeRequest } from "../makeRequest";
import { GetOrderModal, Order } from "../models/order.model";

export const addOrder = async (data: Order) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "/orders/add-order",
      data: { ...data },
    });
    return response.data.data;
  } catch (error) {
    toast.error("Unable to Order");
    throw new Error("Unable to update user");
  }
};

export const getOrderByUser = async (data: GetOrderModal) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "orders/user-order",
      data: { ...data },
    });
    return response.data;
  } catch (error) {
    throw new Error("Unable to fetch user-order" + error);
  }
};
