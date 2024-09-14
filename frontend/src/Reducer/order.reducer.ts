import { createSlice } from "@reduxjs/toolkit";
import { Order } from "../models/order.model";
interface OrderType {
  order: Order[];
  orderPerPage: number;
  currentpage: 1;
}

const initialState: OrderType = {
  order: [],
  orderPerPage: 5,
  currentpage: 1,
};

const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addToList: (state, action) => {
      const currentOrderIds = state.order.map((order) => order.orderId);
      const newOrders = action.payload.filter(
        (order: any) => !currentOrderIds.includes(order.orderId)
      );

      state.order.push(...newOrders);
    },
    onNavigateNextPage: (state) => {
      state.currentpage += 1;
    },
    onNavigatePrevPage: (state) => {
      state.currentpage < 1 ? 1 : (state.currentpage -= 1);
    },
    onClickCurrentPage: (state, action) => {
      state.currentpage = action.payload;
    },
  },
});

export const {
  addToList,
  onNavigateNextPage,
  onClickCurrentPage,
  onNavigatePrevPage,
} = OrderSlice.actions;
export default OrderSlice.reducer;
