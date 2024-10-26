import { makeRequest } from "../makeRequest";
import { AddRevenue } from "../models/revenue.model";

export const getRevenue = async (data: AddRevenue) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "revenue/get-revenue",
      data: { ...data },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while getting revenue" + error);
  }
};
