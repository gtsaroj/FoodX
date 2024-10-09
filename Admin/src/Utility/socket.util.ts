import { io } from "socket.io-client";
import Cookie from "js-cookie";

const token = Cookie.get("accessToken");
const socket = io(process.env.VITE_API_URL, {
  auth: {
    token: token,
  },
  transports: ["websocket", "polling"],
  path: "/socket.io",
});

export { socket };
