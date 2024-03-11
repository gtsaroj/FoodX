import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { getUserDataById } from "../firebase/auth/Authentication.js";
import dotenv from "dotenv";
import { DecodeToken } from "../models/user.model.js";
dotenv.config();

export const verifyJwt = asyncHandler(async (req: any, _: any, next: any) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized access");
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as DecodeToken;

    const user = await getUserDataById(decodedToken.uid);
    if (!user) throw new ApiError(500, "Invalid access token");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(403, "Unauthorized access.");
  }
});
