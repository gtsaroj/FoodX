import { createSlice } from "@reduxjs/toolkit";

export interface ProductType {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: string;
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

  },
});

export const { addToCart, removeCart, resetCart } = productSlice.actions;
export default productSlice.reducer;
