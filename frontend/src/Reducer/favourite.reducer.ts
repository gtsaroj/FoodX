import { createSlice } from "@reduxjs/toolkit";
import { Favourite } from "../models/favourite.model";
import toast from "react-hot-toast";

const favouriteState: Favourite = {
  favourite: [],
};

const favouriteSlice = createSlice({
  name: "favourite",
  initialState: favouriteState,
  reducers: {
    addToFavourite: (state, action) => {
      const productId = state.favourite.find(
        (product) => product.id === action.payload.id
      );
      if (productId) {
        state.favourite = state.favourite.filter(
          (product) => product.id !== action.payload.id
        );
        toast.success("Product removed!")
      } else {
        state.favourite.push(action.payload);
        toast.success("Product added!")
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

export const favouriteReducer = favouriteSlice.reducer;
export const { addToFavourite, removeFavourite, resetFavourite } =
  favouriteSlice.actions;
