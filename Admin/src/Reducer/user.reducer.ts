import { createSlice } from "@reduxjs/toolkit";
import { User } from "../models/user.model";
import {
  signUpAction,
  signInAction,
  updateUserAction,
} from "../Actions/user.actions";

interface authState {
  success: boolean;
  error: boolean;
  loading: boolean;
  userInfo: User;
}

const authState: authState = {
  success: false,
  error: false,
  loading: true,
  userInfo: {
    fullName: "",
    avatar: "",
    email: "",
    role: undefined,
    uid: "",
    amountSpent: 0,
    totalOrder: 0,
  },
};

const authSlice = createSlice({
  initialState: authState,
  name: "auth",
  reducers: {
    authLogout: (state) => {
      state.userInfo = {};
      state.success = false;
      state.loading = true;
    },
  },
  extraReducers: (builder) => {
    // action to add new user
    builder.addCase(signUpAction.pending, (state) => {
      state.loading = false;
    });
    builder.addCase(signUpAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.userInfo = action.payload;
    });
    builder.addCase(signUpAction.rejected, (state) => {
      state.loading = false;
      (state.success = false), (state.userInfo = {});
      state.error = false;
    });
    // action to login existing user
    builder.addCase(signInAction.pending, (state) => {
      state.loading = true;
      state.success = false;
    });
    builder.addCase(signInAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.userInfo = action.payload as User;
    });
    builder.addCase(signInAction.rejected, (state) => {
      state.error = true;
      state.loading = false;
      state.userInfo = {};
    });
    // action to update user
    builder.addCase(updateUserAction.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(updateUserAction.fulfilled, (state, { payload }) => {
        const key = Object.keys(payload);

        state.userInfo[key[0]] = payload[key[0]];
        if (key[1]) {
          state.userInfo[key[1]] = payload[key[1]];
        }
        if (key[2]) {
          state.userInfo[key[2]] = payload[key[2]];
        }
      });
  },
});
export const authReducer = authSlice.reducer;
export const { authLogout } = authSlice.actions;
