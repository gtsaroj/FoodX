import { createSlice } from "@reduxjs/toolkit";
import { registerNewUser } from "./authActions";
import { LoginUser } from "./authLogin";
import { UpdateProfileUser } from "./AuthUpdateUser";
import { ValidationType } from "../models/Register.model";
import { authState } from "../models/UserModels";

// const userToken = localStorage.getItem("userToken");
const initialState: authState = {
  userInfo: {},
  loading: true,
  success: false,
  error: false,
};

const authSlice = createSlice({
  name: "Auth",
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
    // Signup new user
    builder.addCase(registerNewUser.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(registerNewUser.fulfilled, (state, action) => {
        (state.loading = false),
          (state.success = true),
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
        if (action.payload.avatar)
          state.userInfo.avatar = action?.payload?.avatar;
        if (action.payload.fullName)
          state.userInfo.fullName = action?.payload?.fullName;
        if (action.payload.phoneNumber)
          state.userInfo.phoneNumber = action?.payload?.phoneNumber;
        if (action.payload.email) state.userInfo.email = action.payload.email;
      }
    });
  },
});

export default authSlice.reducer;

export const { authLogout } = authSlice.actions;
