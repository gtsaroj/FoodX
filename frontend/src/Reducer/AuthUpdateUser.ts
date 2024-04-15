import { createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../makeRequest";
import { UpdateProfileType } from "../Pages/UpdateProfile/UpdateProfile";
import toast from "react-hot-toast";
import { UpdateProfileInfo } from "../Pages/UpdateProfile/Test";

export const UpdateProfileUser = createAsyncThunk(
  "/auth/update" as any,
  async (updateField: UpdateProfileInfo, { rejectWithValue }) => {
    const { avatar, phoneNumber, email, firstName, lastName } = updateField;

    let fullName;
    if (firstName && lastName) {
      fullName = firstName + " " + lastName;
    }

    console.log(updateField);
    try {
      const response = await makeRequest.post("/users/update-user", {
        fullName,
        phoneNumber,
        avatar,
        email,
      });
      const responseData = response.data.data;
      console.log(responseData);
      toast.success("User Update SuccessFully");
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
