import { createSlice } from "@reduxjs/toolkit";
import { Category } from "../models/category.model";



const categoryState: {categories: Category[]} = {
  categories: [],
};
const categorySlice = createSlice({
  initialState: categoryState,
  name: "category",
  reducers: {
    categoryAdd: (state, action) => {
      const previousCategory : Category[] = state.categories?.filter(
        (category) => category !== action.payload
      );
      state.categories = [...previousCategory, action.payload];
    },
  },
});

export const categoryReducer = categorySlice.reducer;
export const { categoryAdd } = categorySlice.actions;
