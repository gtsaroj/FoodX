import { createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../makeRequest";
import { ValidationType } from "../models/Register.model";
import Cookies from "js-cookie";

export const registerNewUser = createAsyncThunk(
  "auth/register" as any,
  async (RegisterValue: ValidationType, { rejectWithValue }) => {
    try {
      // await makeRequest()
      //   .post("/login", { email }, config)
      //   .then((res : any) => {
      //     const Data = res.data.data;
      //     const userToken = {
      //       refreshToken: Data.refreshToken,
      //       accessToken: Data.accessToken,
      //     };
      //     localStorage.setItem("userToken", JSON.stringify(userToken));
      //   })

      //   .catch((err) => console.log(`error occured while rending : ${err}`));
      const { firstName, lastName, email, password, avatar, phoneNumber } =
        RegisterValue;

     

      const response = await makeRequest().post("/users/signIn", {
        firstName,
        lastName,
        phoneNumber: phoneNumber || "",
        email,
        password,
        avatar : avatar || "",
      });

  const responseData = response.data.data

    //   Cookies.set("refreshToken", responseData.refreshToken, {
    //     expires: 7,
    //     secure: true,
    //  });
    //   Cookies.set("accessToken", responseData.accessToken, {
    //     expires: 7,
    //     secure : true,
    //   })
      return responseData.userInfo;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error);
      }
    }
  }
);
