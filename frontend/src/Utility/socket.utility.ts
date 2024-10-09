import { io } from "socket.io-client";
import Cookie from "js-cookie";

const token = Cookie.get("accessToken");
console.log(token);
const socket = io(import.meta.env.SOCKET_URL, {
  auth: {
    token: token,
  },
  transports: ["websocket", "polling"],
  path: "/socket.io",
});

export { socket };
