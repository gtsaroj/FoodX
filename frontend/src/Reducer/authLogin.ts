import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { globalRequest, makeRequest } from "../makeRequest";

export const LoginUser = createAsyncThunk(
  "auth/login" as any,
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await globalRequest.post("/users/login", { email });
      const responseData = await response.data.data;
      Cookies.set("refreshToken", responseData.refreshToken, {});
      Cookies.set("accessToken", responseData.accessToken, {});
      return responseData.user;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error);
      }
    }
  }
);
