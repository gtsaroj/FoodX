import jwt from "jsonwebtoken";
import {
  getUserDataByEmail,
  getUserDataById,
} from "../firebase/auth/Authentication.js";
import { generateAccessAndRefreshToken } from "../firebase/auth/TokenHandler.js";
import {
  addUserToFirestore,
  getUserFromDatabase,
  updateUserDataInFirestore,
} from "../firebase/db/user.firestore.js";
import { DecodeToken, User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

//Cookie options
const options = {
  httpOnly: true,
};

const loginUser = asyncHandler(async (req: any, res: any) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  try {
    const user = await getUserDataByEmail(email);
    const userDataFromDatabase = await getUserFromDatabase(user.uid);
    if (!user) throw new ApiError(404, "User doesn't exist.");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?.uid
    );
    user.refreshToken = refreshToken;

    //TODO: send privilage value somehow from frontend or firebase and store accordingly.
    await updateUserDataInFirestore(
      user.uid,
      userDataFromDatabase.role,
      "refreshToken",
      refreshToken
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        maxAge: 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        maxAge: 60 * 60 * 1000,
      })
      .json(
        new ApiResponse(
          200,
          { user, accessToken, refreshToken },
          "User logged In Successfully",
          true
        )
      );
  } catch (error) {
    throw new ApiError(400, `User login failed.`);
  }
});

const signUpNewUser = asyncHandler(async (req: any, res: any) => {
  const { firstName, lastName, email, avatar, phoneNumber, role } = req.body;
  console.log(role);
  try {
    const user = await getUserDataByEmail(email);
    if (!user) throw new ApiError(404, "User not found.");
    const { uid } = user;

    const userInfo: User = {
      fullName: `${firstName} ${lastName}`,
      email,
      avatar,
      phoneNumber,
      uid: uid || "",
      refreshToken: "",
      role,
    };

    await addUserToFirestore(userInfo, role);
    return res
      .status(201)
      .json(
        new ApiResponse(201, { userInfo }, "User successfully added", true)
      );
  } catch (error) {
    console.error(error);
    throw new ApiError(400, "Error while adding new user in database.");
  }
});

const logOutUser = asyncHandler(async (req: any, res: any) => {
  try {
    const user = req.user as User;
    const userFromDatabase = await getUserFromDatabase(user.uid);
    await updateUserDataInFirestore(
      user.uid,
      userFromDatabase.role,
      "refreshToken",
      ""
    );
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully", true));
  } catch (error) {
    throw new ApiError(400, "Error logging out.");
  }
});

const refreshAccessToken = asyncHandler(async (req: any, res: any) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  console.log(`Incoming Token = ${incomingRefreshToken}`);

  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized access");

  try {
    console.log(`Trying to decode ....`);
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as DecodeToken;

    console.log(`Decoded ================> ${decodedToken}`);
    const user = await getUserDataById(decodedToken.uid);
    if (!user) throw new ApiError(401, "Invalid token");

    if (incomingRefreshToken !== user.refreshToken)
      throw new ApiError(401, "Refresh token is expired or used");

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user.uid);

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", newRefreshToken)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token refreshed",
          true
        )
      );
  } catch (error) {
    throw new ApiError(400, "Error  on refreshing the Access Token");
  }
});

export { loginUser, logOutUser, signUpNewUser, refreshAccessToken };
