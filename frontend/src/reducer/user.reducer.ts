import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  signInAction,
  signUpAction,
  updateUserAction,
} from "../actions/user.actions";

// Define the initial state
const initialState: Auth.authState = {
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
      (state, action: PayloadAction<Auth.User>) => {
        const payload = action.payload;
        const keys = Object.keys(payload) as Array<keyof Actions.UpdateProfile>;

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
    builder.addCase(updateUserAction.rejected, (_,action) => {
       throw new Error("Error in redux while update user " + action.payload)
    })
  },
});

export const authReducer = authSlice.reducer;
export const { authLogout } = authSlice.actions;
