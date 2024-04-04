import { createSlice } from "@reduxjs/toolkit";
import { authState } from "../models/UserModels";
import { registerNewUser } from "./authActions";
import { LoginUser } from "./authLogin";
import { UpdateProfileUser } from "./AuthUpdateUser";
import { User } from "lucide-react";

// const userToken = localStorage.getItem("userToken");
const initialState: authState = {
  error: null || [],
  loading: true || false,
  success: false,
  userInfo: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authLogout: (state) => {
      (state.loading = false),
        (state.success = false),
        (state.userInfo = null),
        (state.error = null);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerNewUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(registerNewUser.fulfilled, (state, action) => {
        (state.loading = false),
          (state.success = true),
          (state.error = null),
          (state.userInfo = action.payload);
      }),
      builder.addCase(registerNewUser.rejected, (state, action) => {
        (state.loading = false),
          (state.success = false),
          (state.error = action.payload);
      }),
      builder.addCase(LoginUser?.pending, (state) => {
        state.loading = true;
        state.error = null;
      }),
      builder.addCase(LoginUser.fulfilled, (state, action) => {
        (state.loading = false),
          (state.success = true),
          (state.error = null),
          (state.userInfo = action.payload);
      }),
      builder.addCase(LoginUser.rejected, (state, action) => {
        (state.loading = false),
          (state.success = false),
          (state.error = action.payload);
      });
    builder.addCase(UpdateProfileUser.fulfilled, (state, action) => {
      if (state.userInfo) {
     
        state.userInfo.avatar = action?.payload?.avatar;
        state.userInfo.fullName = action.payload.fullName;
        state.userInfo.phoneNumber = action.payload.phoneNumber;
      }
    });
  },
});

export default authSlice.reducer;

export const { authLogout } = authSlice.actions;
