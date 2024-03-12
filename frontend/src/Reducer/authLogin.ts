import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../makeRequest";
import { json } from "react-router-dom";

export const LoginUser = createAsyncThunk(
  "auth/login" as any,
  async (email: string, { rejectWithValue }) => {
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
      const response = await makeRequest().post("/users/login", { email });

      const responseData = await response.data.data;
     Cookies.set("refreshToken", responseData.refreshToken, {
        expires: 7,
        secure: true,
     });
      Cookies.set("accessToken", responseData.accessToken, {
        expires: 7,
        secure : true,
      })
      return responseData.user;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error);
      }
    }
  }
);
