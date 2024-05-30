import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
//importing routes
import userRouter from "./routes/user.routes.js";
import { productRouter } from "./routes/products.routes.js";
import { orderRoutes } from "./routes/orders.routes.js";

const app = express();

app.use(cors());
app.use(cookieParser());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//route handling
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRoutes);

export { app };