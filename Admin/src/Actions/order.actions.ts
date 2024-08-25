import { createAsyncThunk } from "@reduxjs/toolkit";
import * as orderService from "../Services/order.services";

export const getOrderAction = createAsyncThunk(
  "orders/all",
  async (_, thunkApi) => {
    try {
      const response = await orderService.getAllOrder();
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue("Error while getting orders from slice");
    }
  }
);
