import { createSlice } from "@reduxjs/toolkit";
import { ProductType } from "../models/product.model";

const initialState: ProductType = {
  products: [],
};

const productSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const productId = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (productId > -1) {
        state.products[productId].quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
    },
    removeCart: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
    resetCart: (state) => {
      state.products = [];
    },
  },
});

export const { addToCart, removeCart, resetCart } = productSlice.actions;
export const cartReducer =  productSlice.reducer;
