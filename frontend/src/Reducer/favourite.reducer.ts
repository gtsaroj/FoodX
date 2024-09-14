import { createSlice } from "@reduxjs/toolkit";

interface favourie {
  favourite: string[];
}
const favouriteState: favourie = {
  favourite: [],
};

const favouriteSlice = createSlice({
  name: "favourite",
  initialState: favouriteState,
  reducers: {
    addToFavourite: (state, action) => {
      console.log(action);
      const productId = state.favourite.find(
        (product) => product === action.payload
      );
      if (productId) {
        state.favourite = state.favourite.filter(
          (product) => product == action.payload
        );
      } else {
        state.favourite.push(action.payload);
      }
    },
    removeFavourite: (state, action) => {
      state.favourite = state.favourite.filter(
        (product) => product !== action.payload
      );
    },
    resetFavourite: (state) => {
      state.favourite = [];
    },
  },
});

export const favouriteReducer = favouriteSlice.reducer;
export const { addToFavourite, removeFavourite, resetFavourite } =
  favouriteSlice.actions;
