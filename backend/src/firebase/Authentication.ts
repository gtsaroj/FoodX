import { Login, Register } from "../models/user.model.js";
import { auth } from "./index.js";

export const createUser = async (data: Register) => {
  if (!data) throw new Error("Please provide all necessary data");
  try {
    const { email, password, firstName, phoneNumber } = data;
    const userData = await auth
      .createUser({
        email: email,
        password: password,
        displayName: firstName,
        phoneNumber: phoneNumber,
      })
      .then((userCredential) => {
        console.log(userCredential.uid);
        return userCredential?.uid;
      });
  } catch (err) {
    console.error(err);
  }
};

export const getUser = async (data: Login) => {
  if (!data) throw new Error("Please enter necessary information.");
  try {
    const { email } = data;
    const user = await auth.getUserByEmail(email);
    console.log(user);
    console.log(user.uid);
  } catch (err) {
    console.error(err);
  }
};

//! Test Data. Remove Later
const data: Register | Login = {
  email: "aayush@gmail.com",
  password: "helloworld",
  avatar: "img.png",
  firstName: "Aayush",
  lastName: "Lamichhane",
  phoneNumber: "+9779813425299",
};

getUser({ email: "aayush@gmail.com", password: "sadasdsadsa" });
