import { createAsyncThunk } from "@reduxjs/toolkit";
import  * as userAction from "../Services/user.services";
import { ValidationType } from "../models/register.model";
import { UpdateProfileInfo } from "../models/user.model";

interface SigninTypes {
  email: string;
  password: string;
  userRole : "customer"
}

export const singInAction = createAsyncThunk(
  "auth/signin",
  async (data: SigninTypes, { rejectWithValue }) => {
    try {
      const response = await userAction.signIn(data.email, data.password,data.userRole);
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
      const response = await userAction.signUp({ ...data });
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
      const response = await userAction.updateUser({ ...data });
      console.log(response);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        `Error while action to update user -> ${error}`
      );
    }
  }
);
