import { createUser } from "../firebase/Authentication.js";
import { auth } from "../firebase/index.js";
import { app } from "../index.js";
import { Register } from "../models/user.model.js";

app.post("/register", async (req, res) => {
  const { email, password, firstName, lastName, avatar, phoneNumber } =
    req.body;
  const userData: Register = {
    email,
    password,
    firstName,
    lastName,
    avatar,
    phoneNumber,
  };
  const uid = await createUser(userData);
  //create token
});
