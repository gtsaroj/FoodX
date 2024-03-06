
import express, { Express } from "express";
import dotenv from "dotenv";
import { getUser } from "./firebase/Authentication.js";
dotenv.config();
export const app: Express = express();

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`SERVER WAS STARTED AT ${PORT}`);
});
app.get("/test", (req, res) => {
  res.json("Hello");
});

app.get("/register", getUser);