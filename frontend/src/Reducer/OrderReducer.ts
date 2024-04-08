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
    addToList: (state, action) => {
      const currentOrderIds = state.order.map((order) => order.orderId);
      console.log(currentOrderIds)
      const newOrders = action.payload.filter(
        (order: any) => !currentOrderIds.includes(order.orderId)
      );
      console.log(newOrders)
      state.order.push(...newOrders);
    },
  },
});

export const { addToList } = OrderSlice.actions;
export default OrderSlice.reducer;
