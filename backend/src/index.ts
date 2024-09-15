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

io.use(verifySocketUser);

io.on("connection", (socket) => {
  const user = socket.user;
  if (user?.role === "chef") {
    socket.join("chef");
  }
  socket.on("disconnect", () => {
    socket.disconnect();
  });
});
