import { io } from "socket.io-client";
import Cookie from "js-cookie";

const token = Cookie.get("accessToken");
const socket = io("http://localhost:5000", {
  auth: {
    token: token,
  },
});
const getNewOrder = () => {
  const orders: any[] = [];
  socket.on("new_order", (order) => {
    orders.push(order);
  });
  return orders;
};

export { socket, getNewOrder };