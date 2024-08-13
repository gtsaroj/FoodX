import { createSlice } from "@reduxjs/toolkit";
import { Order, Product } from "../models/order.model";

interface ProductsType {
  products: Product[];
}

const initialState: ProductsType = {
  products: [],
};
const favouriteState: { favourite: [] } = {
  favourite: [],
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
    resetCart: (state, action) => {
      state.products = [];
    },
  },
});
const favouriteSlice = createSlice({
  name: "favourite",
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
    resetCart: (state, action) => {
      state.products = [];
    },
  },
});

export const { addToCart, removeCart, resetCart } = productSlice.actions;
export default productSlice.reducer;
