import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { getUserDataByEmail } from "../firebase/Authentication.js";
import dotenv from "dotenv";
import { ApiResponse } from "../utils/ApiResponse.js";
dotenv.config();

export const verifyJwt = asyncHandler(async (req: any, res: any, next: any) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized access");
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    console.log(decodedToken);
    // const user = await getUserDataByEmail(decodedToken.email);
    // if (!user) throw new ApiError(500, "Invalid access token");

    // req.user = user;
    res.json(new ApiResponse(200, { data: decodedToken }, "token sent", true));
    next();
  } catch (error) {
    throw new ApiError(403, "Unauthorized access.");
  }
});
