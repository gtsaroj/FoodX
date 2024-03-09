import {
  createUser,
  getUserDataByEmail,
  getUserDataById,
} from "./firebase/Authentication.js";
import dotenv from "dotenv";

import { logOutUser, loginUser } from "./controllers/user.controller.js";
import { Login, Register } from "./models/user.model.js";
import { app } from "./app.js";
import { getAccessToken } from "./firebase/TokenHandler.js";
import { verifyJwt } from "./middlewares/auth.middlewares.js";
dotenv.config();





const userId = await getUserDataByEmail("aayush@gmail.com");
console.log(userId);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running in port ${process.env.PORT}`);
});
app.get("/test", (_, res) => {
  res.json("Tesing..");
});
app.post("/login", loginUser);
app.post("/logout", verifyJwt);


















//! Test Data. Remove Later
const data: Register | Login = {
  email: "aayush02@gmail.com",
  password: "helloworld",
  avatar: "img.png",
  firstName: "Aayush",
  lastName: "Lamichhane",
  phoneNumber: "+9779813490002",
};

// const userId = await getUser({
//   email: "aayush@gmail.com",
//   password: "sadasdsadsa",
// });
// const uid = await createUser(data);
// console.log(userId);
// console.log(uid);
