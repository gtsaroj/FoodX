import { io } from "socket.io-client";
import Cookie from "js-cookie";

const token = Cookie.get("accessToken");
console.log(token)
const socket = io("http://localhost:5000", {
  auth: {
    token: token,
  },
});

export { socket };
