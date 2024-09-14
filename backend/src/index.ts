import dotenv from "dotenv";
import { app, server } from "./app.js";
dotenv.config();
app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running in port ${process.env.PORT}`);
});
app.get("/test", (_, res) => {
  res.json("Tesing..");
});