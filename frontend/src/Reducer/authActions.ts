import { createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../makeRequest";

export const registerNewUser = createAsyncThunk(
  "auth/register" as any,
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
      const response = await makeRequest().post("/login", { email });

      const responseData = await response.data.data;
      console.log(responseData)
      const userToken = {
        refreshToken: responseData.refreshToken,
        accessToken: responseData.accessToken,
      };
      localStorage.setItem("userToken", JSON.stringify(userToken));
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
