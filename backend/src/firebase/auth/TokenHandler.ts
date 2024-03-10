import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/ApiError.js";
import { getUserDataById } from "./Authentication.js";

export const getAccessToken = async (uid: string) => {
  try {
    const { email } = await getUserDataById(uid);
    return jwt.sign(
      {
        uid: uid,
        email: email,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  } catch (error) {
    console.error(error);
    throw new ApiError(400, "Error while generating access token.");
  }
};

const getRefreshtoken = async (uid: string) => {
  try {
    return jwt.sign(
      {
        uid: uid,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
  } catch (error) {
    throw new ApiError(400, "Error while generating refresh token.");
  }
};

export const generateAccessAndRefreshToken = async (uid: string) => {
  if (!uid) throw new ApiError(401, "User doesnt exist.");

  try {
    const accessToken = await getAccessToken(uid);
    const refreshToken = await getRefreshtoken(uid);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens.");
  }
};
