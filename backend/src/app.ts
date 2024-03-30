import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
//importing routes
import userRouter from "./routes/user.routes.js";
import { productRouter } from "./routes/products.routes.js";

const app = express();

const corOrigin = {
  origin: "http://localhost:5173",
  Credential : true,
};

app.use(cors(corOrigin));
app.use(cookieParser());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//route handling
app.use("/users", userRouter);
app.use("/products", productRouter);

export { app };
