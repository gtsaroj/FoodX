import { makeRequest } from "../makeRequest";
import { Revenue } from "../models/revenue.model";

export const addRevenue = async (data: Revenue) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "revenue/add-revenue",
      data: { ...data },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while adding revenue");
  }
};
