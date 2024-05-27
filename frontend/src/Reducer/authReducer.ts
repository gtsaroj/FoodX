import { createSlice } from "@reduxjs/toolkit";
import { authState } from "../models/UserModels";
import { registerNewUser } from "./authActions";
import { LoginUser } from "./authLogin";
import { UpdateProfileUser } from "./AuthUpdateUser";
import { singInAction, singUpAction, updateUserAction } from "./Action";

// const userToken = localStorage.getItem("userToken");
const initialState: authState = {
  error: null,
  loading: true,
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
    // Sign up new user
    builder.addCase(singUpAction?.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(singUpAction?.fulfilled, (state, action) => {
        (state.loading = false),
          (state.success = true),
          (state.userInfo = action.payload);
      }),
      builder.addCase(singUpAction?.rejected, (state, action) => {
        (state.loading = false),
          (state.success = false),
          (state.error = action.payload);
      }),
      // sign in existed user
      builder.addCase(singInAction?.pending, (state) => {
        state.loading = true;
        state.error = null;
      }),
      builder.addCase(singInAction.fulfilled, (state, action) => {
        (state.loading = false),
          (state.success = true),
          (state.error = null),
          (state.userInfo = action.payload);
      }),
      builder.addCase(singInAction.rejected, (state, action) => {
        (state.loading = false),
          (state.success = false),
          (state.error = action.payload);
      });

    // update existed user
    builder.addCase(updateUserAction.fulfilled, (state, action) => {
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
