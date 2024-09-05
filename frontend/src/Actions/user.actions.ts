import { createAsyncThunk } from "@reduxjs/toolkit";
import * as userAction from "../Services/user.services";
import { ValidationType } from "../models/register.model";
import { UpdateProfileInfo } from "../models/user.model";

export interface SigninTypes {
  email: string;
  password: string;
  userRole: "customer";
}

const signInAction = createAsyncThunk(
  "auth/signIn",
  async (data: SigninTypes, { rejectWithValue }) => {
    try {
      const response = await userAction.signIn(
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
const signUpAction = createAsyncThunk(
  "auth/signUp",
  async (data: ValidationType, thunkApi) => {
    try {
      const response = await userAction.signUp({ ...data });
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        `Error while action to sign up new user -> ${error}`
      );
    }
  }
);

const updateUserAction = createAsyncThunk(
  "auth/update-user",
  async (data: UpdateProfileInfo, thunkApi) => {
    try {
      const response = await userAction.updateAccount({ ...data });
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        `Error while action to update user -> ${error}`
      );
    }
  }
);

export { signInAction, signUpAction, updateUserAction };
