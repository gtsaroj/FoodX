import { getUserFromDatabase } from "../firebase/db/user.firestore.js";
import { DecodeToken } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const verifySocketUser = async (socket: any, next: any) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token)
      throw new ApiError(401, "Unauthorized access, Tokens unaviable.");

    const decodedAccessToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as DecodeToken;

    const user = await getUserFromDatabase(
      `${decodedAccessToken.uid}`,
      decodedAccessToken.role
    );
    if (!user) throw new ApiError(404, "User doesn't exist.");

    socket.user = user;
    next();
  } catch (error) {
    next(
      new ApiError(
        401,
        "Error while verifying user for socket connection",
        null,
        error as string[]
      )
    );
  }
};

export const verifySocketChef = async (socket: any, next: any) => {
  try {
    const user = socket.user;

    if (!user) throw new ApiError(404, "No user found while verifying chef");

    if (user.role !== "chef") throw new ApiError(403, "Unauthorized access.");

    next();
  } catch (error) {
    next(new ApiError(401, "Error while verifying chef."));
  }
};
