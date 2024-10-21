import { createSlice } from "@reduxjs/toolkit";
import { Order } from "../models/order.model";
interface OrderType {
  order: Order[];
}

const initialState: OrderType = {
  order: [],
};

const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      const isOrderExist = state?.order?.some(
        (order) => order.orderId === action.payload.orderId
      );
      if (!isOrderExist) {
        state.order.push(action.payload);
      }
    },
    removeOrder: (state, action) => {
      state.order = state.order.filter(
        (order) => order.orderId !== action.payload
      );
    },
    updateOrder: (state, action) => {
      const findOrder = state?.order?.find(
        (order) => order.orderId === action.payload.orderId
      );
      if (findOrder) {
        findOrder.status = action.payload.status;
      }
    },
    resetOrder: (state) => {
      state.order = [];
    },
  },
});

export const { addOrder, removeOrder, resetOrder,updateOrder } = OrderSlice.actions;
export default OrderSlice.reducer;
