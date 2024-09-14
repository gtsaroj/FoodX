import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authState, UpdateProfileInfo } from "../models/user.model";
import { ValidationType } from "../models/register.model";
import * as userAction from "../Services/user.services";
import { SigninTypes } from "../Actions/user.actions";

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
// Define the initial state
const initialState: authState = {
  error: null,
  loading: true,
  success: false,
  userInfo: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authLogout: (state) => {
      state.loading = false;
      state.success = false;
      state.userInfo = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Sign up new user
    builder.addCase(signUpAction.pending, (state) => {
      state.loading = true;
      state.userInfo = {};
    });
    builder.addCase(
      signUpAction.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true;
        state.userInfo = action.payload;
      }
    );
    builder.addCase(
      signUpAction.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      }
    );

    // Sign in existing user
    builder.addCase(signInAction.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.userInfo = {};
    });
    builder.addCase(
      signInAction.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.userInfo = action.payload;
      }
    );
    builder.addCase(
      signInAction.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      }
    );

    // Update existing user
    builder.addCase(updateUserAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateUserAction.fulfilled,
      (state, action: PayloadAction<UpdateProfileInfo>) => {
        const payload = action.payload;
        const keys = Object.keys(payload) as Array<keyof UpdateProfileInfo>;

        keys.forEach((key) => {
          if (payload[key] !== undefined) {
            // Handle phoneNumber separately if needed
            if (key === "phoneNumber" && typeof payload[key] === "number") {
              state.userInfo[key] = String(payload[key]); // Convert number to string
            } else {
              state.userInfo[key] = payload[key] as string | undefined;
            }
          }
        });
      }
    );
  },
});

export const authReducer = authSlice.reducer;
export const { authLogout } = authSlice.actions;
