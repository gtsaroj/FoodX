import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { rootRouter } from "./routes/root.routes.js";
import { initializeSocket } from "./utils/socket/index.js";
import errorHandler from "./middlewares/error/errorHandler.js";
dotenv.config();

const app = express();

app.get("/test", (_, res) => {
  res.status(200).send("Running on server.");
});

app.use(cors());
app.use(cookieParser());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

const { io, server } = initializeSocket(app);
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//route handling
app.use("/api/v1", rootRouter);

app.use(errorHandler);

export default app;
export { io };
