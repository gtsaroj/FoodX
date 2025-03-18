import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const get_productFeedback = async (
  data: Common.FetchPaginate<keyof Model.FeedbackDetail, "">
): Promise<
  Api.Response<{
    feedbacks: Model.FeedbackDetail[];
    currentFirstDoc: string;
    currentLastDoc: string;
    length: number;
  }>
> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "feedback/get",
      data: { ...data },
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error?.response;
      throw new ApiError(status, data?.message, data?.errors, false);
    }
    throw new ApiError(500);
  }
};
