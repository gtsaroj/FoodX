import { createAsyncThunk } from "@reduxjs/toolkit";
import  * as productService from "../Services/product.services"

export const postProductAction = createAsyncThunk(
    "products/new",
    async ({ data, cb }: { data: any; cb: () => void }, thunkApi) => {
      try {
        const response = await productService.addProducts(data);
        cb();
        return response;
      } catch (error) {
        return thunkApi.rejectWithValue("Error while posting new product");
      }
    }
  );
  export const getProductAction = createAsyncThunk(
    "products/all",
    async (_, thunkApi) => {
      try {
        const response = await productService.getProducts();
        return response;
      } catch (error) {
        return thunkApi.rejectWithValue("Error while getting orders from slice");
      }
    }
  );