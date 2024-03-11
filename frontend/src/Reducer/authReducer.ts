import { createSlice } from "@reduxjs/toolkit";
import { authState } from "../models/UserModels";
import { registerNewUser } from "./authActions";
import { LoginUser } from "./authLogin";

// const userToken = localStorage.getItem("userToken");
const initialState: authState = {
  error: null || [],
  loading: true || false,
  success: false,
  userInfo: [],
};

const authSlice = createSlice({
  name: "register",
  initialState,
  reducers: {},
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
      });
  },
});
const authLoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(LoginUser.pending, (state) => {
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
  },
});

export const registerSlice =  authSlice.reducer;
export const loginSlice = authLoginSlice.reducer
