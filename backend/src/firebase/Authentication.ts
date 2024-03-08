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
        return userCredential?.uid;
      });
    const userToken = await auth
      .createCustomToken(userData)
      .then((token) => token);
    if (!userToken) return "Unable to create new User. Please try again later.";
    return userToken;
  } catch (err) {
    console.error(err);
    return err as string;
  }
};

export const getUser = async (data: Login) => {
  if (!data) throw new Error("Please enter necessary information.");
  try {
    const { email } = data;
    const user = await auth.getUserByEmail(email);
    return user.uid as string;
  } catch (err) {
    console.error(err);
    return err as string;
  }
};

//! Test Data. Remove Later
const data: Register | Login = {
  email: "aayush02@gmail.com",
  password: "helloworld",
  avatar: "img.png",
  firstName: "Aayush",
  lastName: "Lamichhane",
  phoneNumber: "+9779813490002",
};

const userId = await getUser({
  email: "aayush@gmail.com",
  password: "sadasdsadsa",
});
const uid = await createUser(data);
console.log(userId);
console.log(uid);
