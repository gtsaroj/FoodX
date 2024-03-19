import { createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../makeRequest";
import { ValidationType } from "../models/Register.model";
import Cookies from "js-cookie";
import { Role } from "../Components/Register/Validation";

export const getAccessAndRefreshToken = async (email: string) => {
  const responseData = await makeRequest.post("/users/login", { email });
  const data = await responseData.data.data;

  Cookies.set("refreshToken", data.refreshToken, {
    expires: 7,
    secure: true,
  });
  Cookies.set("accessToken", data.accessToken, {
    expires: 7,
    secure: true,
  });
};

export const registerNewUser = createAsyncThunk(
  "auth/register" as any,
  async (RegisterValue: ValidationType, { rejectWithValue }) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        avatar,
        phoneNumber,
      } = RegisterValue;

      const response = await makeRequest.post("/users/signIn", {
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        avatar,
        role: Role.customer,
      });
      const responseData = await response.data.data;
      await getAccessAndRefreshToken(email);
      return responseData.userInfo;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error);
      }
    }
  }
);
