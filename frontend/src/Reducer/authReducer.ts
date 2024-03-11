import { createSlice } from "@reduxjs/toolkit";
import { authState } from "../models/UserModels";
import { registerNewUser } from "./authActions";

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
          state.success = false,
          (state.error = action.payload);
      });
  },
});

export default authSlice.reducer;
