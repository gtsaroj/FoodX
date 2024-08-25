import { GetOrderModal } from "../../../backend/src/models/order.model";
import { authLogout } from "../Reducer/Action";
import { Store } from "../Store";
import { makeRequest } from "../makeRequest";

export const getOrders = async (data: GetOrderModal) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "orders/get-orders",
      data: { ...data },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error while getting orders : ${error}`);
  }
};

export const getAllOrder = async () => {
  try {
    const response = await makeRequest({
      method: "get",
      url: "orders/all-orders",
    });

    return response.data.data;
  } catch (error) {
    throw new Error(`Error while getting orders : ${error}`);
  }
};

export const getOrderByUser = async (id: string) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "orders/user-order",
      data: { id: id },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while getting user-order" + error);
  }
};

export const updateOrderStatus = async (data: {
  id: string;
  status: string;
}) => {
  try {
    const response = await makeRequest({
      method: "put",
      data: { id: data.id, status: data.status },
      url: "orders/update-order",
    });
    return response.data.data;
  } catch (error) {
    throw new Error("unable to update order status" + error);
  }
};
