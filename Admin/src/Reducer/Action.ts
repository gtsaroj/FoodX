import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as ProductService from "../Services";
import { Product } from "../models/order.model";
import { ValidationType } from "../models/Register.model";
import { UpdateProfileInfo } from "../Pages/Admin/AdminProfile";
import { authState } from "../models/UserModels";
import { Satellite } from "lucide-react";
import { stat } from "fs";

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

const authState: authState = {
  success: true,
  error: false,
  loading: true,
  userInfo: [],
};

interface SigninTypes {
  email: string;
  password: string;
}

export const singInAction = createAsyncThunk(
  "auth/signin",
  async (data: SigninTypes, { rejectWithValue }) => {
    try {
      const response = await ProductService.signIn(data.email, data.password);
      return response;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error);
      }
    }
  }
);
export const singUpAction = createAsyncThunk(
  "auth/singup",
  async (data: ValidationType, thunkApi) => {
    try {
      const response = await ProductService.signUp({ ...data });
      console.log(response);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        `Error while action to sign up new user -> ${error}`
      );
    }
  }
);
export const updateUserAction = createAsyncThunk(
  "auth/update-user",
  async (data: UpdateProfileInfo, thunkApi) => {
    try {
      const response = await ProductService.updateUser({ ...data });
      console.log(response);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        `Error while action to update user -> ${error}`
      );
    }
  }
);

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

const authSlice = createSlice({
  initialState: authState,
  name: "auth",
  reducers: {
    authLogout: (state) => {
      state.userInfo = null;
      if (state.success) state.success = false;
      state.loading = true;
    },
  },
  extraReducers: (builder) => {
    // action to add new user
    builder.addCase(singUpAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(singUpAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.userInfo = action.payload;
    });
    builder.addCase(singUpAction.rejected, (state) => {
      state.loading = false;
      (state.success = false), (state.userInfo = null);
      state.error = false;
    });
    // action to login existing user
    builder.addCase(singInAction.pending, (state) => {
      state.loading = true;
      state.success = false;
    });
    builder.addCase(singInAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.userInfo = action.payload;
    });
    builder.addCase(singInAction.rejected, (state) => {
      state.error = true;
      state.loading = false;
      state.userInfo = null;
    });
    // action to update user
  },
});

export const ProductReducer = ProductSlice.reducer;
export const AuthReducer = authSlice.reducer;

export const { authLogout } = authSlice.actions;
