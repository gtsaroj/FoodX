import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as ProductService from "../Services";
import { Product } from "../models/order.model";

interface ProductState {
  products: Product[] | null;
  loading: boolean;
  success: boolean;
  error: boolean;
}

const initialState: ProductState = {
  products: [],
  loading: true,
  success: false,
  error: false,
};

export const getOrderAction = createAsyncThunk(
  "orders/all",
  async (_, thunkApi) => {
    try {
      const response = await ProductService.getOrders();
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue("Error while getting orders from slice");
    }
  }
);
export const postProductAction = createAsyncThunk(
  "products/new",
  async ({ data, cb }: { data: any; cb: () => void }, thunkApi) => {
    try {
      const response = await ProductService.postProducts(data);
      cb();
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue("Error while posting new product");
    }
  }
);
export const postBannerAction = createAsyncThunk(
  "banner/new",
  async ({ data, cb }: { data: any; cb: () => void }, thunkApi) => {
    try {
      const response = await ProductService.postBanners(data);
      cb();
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue("Error while posting new banner");
    }
  }
);
export const getProductAction = createAsyncThunk(
  "products/all",
  async (_, thunkApi) => {
    try {
      const response = await ProductService.getProducts();
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue("Error while getting orders from slice");
    }
  }
);
export const getBannerAction = createAsyncThunk(
  "banner/all",
  async (_, thunkApi) => {
    try {
      const response = await ProductService.getBanners();
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue("Error while getting orders from slice");
    }
  }
);

const ProductSlice = createSlice({
  initialState,
  name: "Products",
  reducers: {},
  extraReducers: (builder) => {
    //get orders
    builder.addCase(getOrderAction.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getOrderAction.fulfilled, (state, action) => {
      (state.loading = false), (state.success = true);
      state.products = action.payload;
    });
    builder.addCase(getOrderAction.rejected, (state) => {
      (state.loading = false),
        (state.success = false),
        (state.error = true),
        (state.products = null);
    });
    //get products
    builder.addCase(getProductAction.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getProductAction.fulfilled, (state, action) => {
      (state.loading = false), (state.success = true);
      state.products = action.payload;
    });
    builder.addCase(getProductAction.rejected, (state) => {
      (state.loading = false),
        (state.success = false),
        (state.error = true),
        (state.products = null);
    });
    //get banners
    builder.addCase(getBannerAction.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getBannerAction.fulfilled, (state, action) => {
      (state.loading = false), (state.success = true);
      state.products = action.payload;
    });
    builder.addCase(getBannerAction.rejected, (state) => {
      (state.loading = false),
        (state.success = false),
        (state.error = true),
        (state.products = null);
    });
  },
});

export const ProductReducer = ProductSlice.reducer;
