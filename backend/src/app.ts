import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
//importing routes
import userRouter from "./routes/user.routes.js";
import { productRouter } from "./routes/products.routes.js";
import { orderRoutes } from "./routes/orders.routes.js";
import { ticketRouter } from "./routes/ticket.routes.js";
import { logRouter } from "./routes/logs.routes.js";
import { categoryRouter } from "./routes/category.routes.js";
import { bannerRouter } from "./routes/banner.routes.js";
import { revenueRouter } from "./routes/revenue.routes.js";
import favouriteRouter from "./routes/favourites.routes.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { verifyRouter } from "./routes/verify.routes.js";
import { notificationRouter } from "./routes/notification.routes.js";
import cartRouter from "./routes/cart.routes.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_URL,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
  path: "/socket.io",
});

app.use(cors());
app.use(cookieParser());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//route handling
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRoutes);
app.use("/tickets", ticketRouter);
app.use("/logs", logRouter);
app.use("/categories", categoryRouter);
app.use("/banners", bannerRouter);
app.use("/revenue", revenueRouter);
app.use("/favourites", favouriteRouter);
app.use("/otp", verifyRouter);
app.use("/notification", notificationRouter);
app.use("/cart", cartRouter);

export { app, io, server };
