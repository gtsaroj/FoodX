import dotenv from "dotenv";
import { app, server, io } from "./app.js";
import { verifySocketUser } from "./middlewares/socket.middlewares.js";

dotenv.config();
server.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running in port ${process.env.PORT}`);
});
app.get("/test", (_, res) => {
  res.json("Tesing..");
});

export const userSocketMap: Record<string, string> = {};
io.use(verifySocketUser);

io.on("connection", (socket) => {
  const user = socket.user;
  const userId = user!.uid;
  userSocketMap[userId] = socket.id;
  console.log(`socket id: ${userSocketMap[userId]}`);
  if (user?.role === "chef") {
    socket.join("chef");
  }
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    socket.disconnect();
  });
});
