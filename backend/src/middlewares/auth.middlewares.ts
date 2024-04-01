import jwt, { TokenExpiredError } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import dotenv from "dotenv";
import { DecodeToken } from "../models/user.model.js";
import {
  getUserFromDatabase,
} from "../firebase/db/user.firestore.js";
dotenv.config();

export const verifyJwt = asyncHandler(async (req: any, res: any, next: any) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken)
      throw new ApiError(401, "Unauthorized access, Tokens unaviable.");

    //verify access token
    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as DecodeToken;
    console.log(`Access token: \n ${decodedAccessToken.uid}`);

    const user = await getUserFromDatabase(`${decodedAccessToken.uid}`);
    if (!user) throw new ApiError(404, "User doesn't exist.");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, (error as string) || "Error while verifying jwt token.");
  }
});
