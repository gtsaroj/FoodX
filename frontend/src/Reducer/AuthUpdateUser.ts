import { createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../makeRequest";
import { UpdateProfileType } from "../Pages/UpdateProfile/UpdateProfile";

export const UpdateProfileUser = createAsyncThunk(
  "/auth/update" as any,
  async (updateField: UpdateProfileType, { rejectWithValue }) => {
    const { fullName, phoneNumber, avatar } = updateField;
    console.log(avatar)

    try {
      const response = await makeRequest.post("/users/update-user", {
        fullName,
        phoneNumber,
        avatar,
      });
      const responseData = response.data.data;
      return responseData;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error);
      }
    }
  }
);
