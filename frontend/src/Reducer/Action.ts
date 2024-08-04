import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Action from "../Services";
import { ValidationType } from "../models/Register.model";
import { UpdateProfileInfo } from "../Pages/UpdateProfile/ProfileSection";

interface SigninTypes {
  email: string;
  password: string;
  userRole : "customer"
}

export const singInAction = createAsyncThunk(
  "auth/signin",
  async (data: SigninTypes, { rejectWithValue }) => {
    try {
      const response = await Action.signIn(data.email, data.password,data.userRole);
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
export const singUpAction = createAsyncThunk(
  "auth/singup",
  async (data: ValidationType, thunkApi) => {
    try {
      const response = await Action.signUp({ ...data });
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
      const response = await Action.updateUser({ ...data });
      console.log(response);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        `Error while action to update user -> ${error}`
      );
    }
  }
);
