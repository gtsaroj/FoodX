import jwt from "jsonwebtoken";
import {
  getUserDataByEmail,
  getUserDataById,
} from "../firebase/auth/Authentication.js";
import { generateAccessAndRefreshToken } from "../firebase/auth/TokenHandler.js";
import {
  addUserToFirestore,
  deleteUserFromFireStore,
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
  secure: true,
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
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
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
  const incomingRefreshToken: string =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized access");
  console.log("-----------------------------------------------");
  console.log(`From refresh Access token: \n ${incomingRefreshToken}`);
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as DecodeToken;
    console.log(`Decoded Token: \n ${decodedToken.uid}`);

    const user = await getUserFromDatabase(decodedToken.uid.trim());
    if (!user) throw new ApiError(404, "User not found.");
    console.log(`User refresh token from database: \n${user.refreshToken}`);

    if (incomingRefreshToken !== user.refreshToken)
      throw new ApiError(403, "Refresh token is expired or used");

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user.uid);

    await updateUserDataInFirestore(
      user.uid,
      user.role,
      "refreshToken",
      newRefreshToken
    );

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
    res.status(403).clearCookie("accessToken").clearCookie("refreshToken");
    console.log(error);
    res;
    throw new ApiError(403, "Error  on refreshing the Access Token");
  }
});

const deleteAccount = asyncHandler(async (req: any, res: any) => {
  try {
    const user = req.user as User;
    const foundUser = await getUserFromDatabase(user.uid);
    if (!foundUser) throw new ApiError(404, "User not found.");

    //
    await deleteUserFromFireStore(foundUser.uid, foundUser.role);
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User deleted successfully", true));
  } catch (error) {
    throw new ApiError(400, "Error deleting user from firestore.");
  }
});

const updateUser = asyncHandler(async (req: any, res: any) => {
  try {
    const { fullName, phoneNumber, avatar } = req.body;
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as DecodeToken;

    const user = await getUserFromDatabase(decodedToken.uid);
    console.log(fullName, phoneNumber);

    if (!fullName && !phoneNumber && avatar)
      throw new ApiError(400, "No data provided to update.");

    if (fullName) {
      await updateUserDataInFirestore(
        user.uid,
        user.role,
        "fullName",
        fullName
      );
    }

    if (phoneNumber) {
      await updateUserDataInFirestore(
        user.uid,
        user.role,
        "phoneNumber",
        phoneNumber
      );
    }

    if (avatar) {
      await updateUserDataInFirestore(user.uid, user.role, "avatar", avatar);
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { fullName, phoneNumber },
          "Successfully updated user data.",
          true
        )
      );
  } catch (error) {
    throw new ApiError(400, "Error updating user in database.");
  }
});

export {
  loginUser,
  logOutUser,
  signUpNewUser,
  refreshAccessToken,
  deleteAccount,
  updateUser,
};
