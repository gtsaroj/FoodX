import { getAuth } from "firebase-admin/auth";
import { Login, Register } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
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
    return userData;
  } catch (err) {
    console.error("Error creating user: ", err);
    return err as string;
  }
};

export const getUserDataById = async (uid: string) => {
  if (!uid) throw new ApiError(400, "Uid required.");
  try {
    const user = await auth.getUser(uid).then((userData) => {
      const { uid, email, displayName, phoneNumber } = userData;
      return { uid, email, displayName, phoneNumber };
    });
    return user;
  } catch (error) {
    throw new ApiError(401, "Something went wrong.");
  }
};

export const getUserDataByEmail = async (email: string) => {
  if (!email) throw new ApiError(400, "Please enter necessary information.");
  try {
    const user = await auth.getUserByEmail(email).then((userData) => {
      const { uid, email, displayName, phoneNumber } = userData;
      return { uid, email, displayName, phoneNumber };
    });
    return user;
  } catch (err) {
    throw new ApiError(404, "User not found.");
  }
};
