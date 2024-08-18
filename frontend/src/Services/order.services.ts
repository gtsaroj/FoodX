import toast from "react-hot-toast";
import { makeRequest } from "../makeRequest";
import { Order } from "../models/order.model";

export const order = async (data: Order) => {
    try {
      const response = await makeRequest({
        method: "post",
        url: "/orders/add-order",
        data: { ...data },
      });
      console.log(response.statusText);
      return response.data.data;
    } catch (error) {
      toast.error("Unable to Order");
      throw new Error("Unable to update user");
    }
  };