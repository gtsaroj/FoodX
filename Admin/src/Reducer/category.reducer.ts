import { createSlice } from "@reduxjs/toolkit";



const categoryState = {
  categories: [],
};
const categorySlice = createSlice({
  initialState: categoryState,
  name: "category",
  reducers: {
    categoryAdd: (state, action) => {
      const previousCategory = state.categories?.filter(
        (category) => category !== action.payload
      );
      state.categories = [...previousCategory, action.payload];
    },
  },
});

export const categoryReducer = categorySlice.reducer;
export const { categoryAdd } = categorySlice.actions;
