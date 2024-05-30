import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/ApiError.js";
import { getUserDataById } from "./Authentication.js";
import {
  getUserFromDatabase,
  updateUserDataInFirestore,
} from "../db/user.firestore.js";
import { RoleType } from "../../models/user.model.js";

export const getAccessToken = async (uid: string, role: RoleType) => {
  try {
    return jwt.sign(
      {
        uid: uid,
        role,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  } catch (error) {
    console.error(error);
    throw new ApiError(400, "Error while generating access token.");
  }
};

const getRefreshtoken = async (uid: string, role: RoleType) => {
  try {
    return jwt.sign(
      {
        uid: uid,
        role,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
  } catch (error) {
    throw new ApiError(400, "Error while generating refresh token.");
  }
};

export const generateAccessAndRefreshToken = async (
  uid: string,
  role: RoleType
) => {
  try {
    const user = await getUserFromDatabase(uid);
    if (!user) throw new ApiError(401, "User doesnt exist.");

    const accessToken = await getAccessToken(uid, role);
    const refreshToken = await getRefreshtoken(uid, role);

    user.refreshToken = refreshToken;
    await updateUserDataInFirestore(
      uid,
      user.role,
      "refreshToken",
      refreshToken
    );

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens.");
  }
};
