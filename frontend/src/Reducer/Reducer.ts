import { createSlice } from "@reduxjs/toolkit";

export interface ProductType {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface ProductsType {
  products: ProductType[];
}

const initialState: ProductsType = {
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
    resetCart: (state, action) => {
      state.products = [];
    },
  },
});

export const { addToCart, removeCart, resetCart } = productSlice.actions;
export default productSlice.reducer;
