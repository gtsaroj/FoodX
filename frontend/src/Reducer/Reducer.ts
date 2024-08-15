import { createSlice } from "@reduxjs/toolkit";
import { Product } from "../models/order.model";
import toast from "react-hot-toast";

interface ProductsType {
  products: Product[];
}

const initialState: ProductsType = {
  products: [],
};
const favouriteState: { favourite: Product[] } = {
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
  initialState: favouriteState,
  reducers: {
    addToFavourite: (state, action) => {
      const productId = state.favourite.findIndex(
        (product) => product.id === action.payload.id
      );
      console.log(action)
      if (productId > -1) {
        toast.success("Product already exist")
      } else {
        state.favourite.push(action.payload);
      }
    },
    removeFavourite: (state, action) => {
      state.favourite = state.favourite.filter(
        (product) => product.id !== action.payload
      );
    },
    resetFavourite: (state, action) => {
      state.favourite = [];
    },
  },
});

export const { addToFavourite, removeFavourite, resetFavourite } =
  favouriteSlice.actions;

export const { addToCart, removeCart, resetCart } = productSlice.actions;
export default productSlice.reducer;
export const favouriteReducer = favouriteSlice.reducer;
