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

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5500",
    methods: ["GET", "POST"],
  },
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

export { app, io, server };
