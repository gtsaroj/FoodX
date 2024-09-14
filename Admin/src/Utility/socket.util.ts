import { io } from "socket.io-client";
import Cookie from "js-cookie";

const token = Cookie.get("accessToken");
const socket = io("http://localhost:5000", {
  auth: {
    token: token,
  },
});

const sendWs = (path: string, data: any) => {
  socket.emit(path, data);
};

export { socket, sendWs };
