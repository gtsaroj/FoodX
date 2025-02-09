import { makeRequest } from "../makeRequest";

export const addRevenue = async (
  data: Model.Revenue
): Promise<Api.Response<null>> => {
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
