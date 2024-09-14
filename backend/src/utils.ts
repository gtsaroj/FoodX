import { io } from "./app.js";
import {
  verifySocketChef,
  verifySocketUser,
} from "./middlewares/socket.middlewares.js";

io.use(verifySocketUser);

io.on("connection", (socket) => {
  console.log("Client connected", socket.id);

  verifySocketChef(socket, (err: any) => {
    if (err) {
      socket.disconnect();
      return;
    }
  });

  socket.join("chef");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
