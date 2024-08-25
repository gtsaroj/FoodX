import { createAsyncThunk } from "@reduxjs/toolkit";
import * as userService from "../Services/user.services";
import { Register } from "../models/user.model";
import { UpdateProfileInfo } from "../Pages/Profile/AdminProfile";

export const signInAction = createAsyncThunk(
  "auth/signin",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await userService.signIn(
        data.email,
        data.password,
        data.userRole
      );
      return response;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error);
      }
    }
  }
);
export const signUpAction = createAsyncThunk(
  "auth/singup",
  async (data: Register, thunkApi) => {
    try {
      const response = await userService.signUp({ ...data });
      console.log(response);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        `Error while action to sign up new user -> ${error}`
      );
    }
  }
);
export const updateUserAction = createAsyncThunk(
  "auth/update-user",
  async (data: UpdateProfileInfo, thunkApi) => {
    try {
      const response = await userService.updateAccount({ ...data });
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        `Error while action to update user -> ${error}`
      );
    }
  }
);
