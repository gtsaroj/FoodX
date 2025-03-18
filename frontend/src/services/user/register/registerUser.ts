import { globalRequest } from "@/globalRequest";
import { ApiError, handleApiError } from "@/helpers";
import axios from "axios";
import Cookies from "js-cookie";

export const signUp = async (
  data: Auth.ValidationType
): Promise<
  Api.Response<
    Auth.User & {
      createdAt: Common.TimeStamp;
      updatedAt: Common.TimeStamp;
      refreshToken: string;
      accessToken: string;
    }
  >
> => {
  try {
    const response = (await globalRequest({
      method: "post",
      url: "/auth/sign-up",
      data: { ...data },
    })) as {
      data: Api.Response<
        Auth.User & {
          accessToken: string;
          refreshToken: string;
          createdAt: Common.TimeStamp;
          updatedAt: Common.TimeStamp;
        }
      >;
    };

    Cookies.set("accessToken", response?.data?.data?.accessToken);
    Cookies?.set("refreshToken", response?.data?.data?.refreshToken);
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error?.response?.status || 500;
      const message = error?.response?.data?.message;
      const errorMessage = error?.response?.data?.error;
      throw new ApiError(statusCode, message, errorMessage, false);
    }
    throw new ApiError(500);
  }
};
