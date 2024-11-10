import { generateAccessAndRefreshToken } from "../firebase/auth/TokenHandler.js";
import { deleteUserFromFirebase } from "../firebase/auth/userHandler.js";
import {
  addUserToFirestore,
  getUserFromDatabase,
} from "../firebase/db/user.firestore.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { redisClient } from "../utils/Redis.js";
const options = {
  httpOnly: true,
  secure: true,
};
export const verifyOtp = asyncHandler(async (req: any, res: any) => {
  const { code, uid } = req.body;
  try {
    const data = await redisClient.get(`otp:${uid}`);
    const userInfo = await redisClient.get(`register_user:${uid}`);

    if (!data) {
      return res.status(404).json(new ApiError(404, "OTP not found."));
    }
    if (!userInfo) {
      await deleteUserFromFirebase(uid);
      return res
        .status(404)
        .json(new ApiError(404, "User not registered. Please try again"));
    }
    const user = await JSON.parse(userInfo);
    if (data && +data === +code) {
      await addUserToFirestore(user, user.role);
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user.uid,
        user.role
      );
      user.refreshToken = refreshToken;
      const userFromDatabase = await getUserFromDatabase(user.uid, user.role);
      redisClient.del(`otp:${uid}`);
      redisClient.del(`register_user:${uid}`);
      return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            201,
            { userInfo: userFromDatabase, accessToken, refreshToken },
            "User successfully verified and added",
            true
          )
        );
    } else {
      return res.status(400).json(new ApiError(400, "Invalid otp."));
    }
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(
        500,
        error as string[],
        "Error verifying otp.",

        false
      )
    );
  }
});
