import jwt from "jsonwebtoken";
import {
  getUserDataByEmail,
  getUserDataById,
} from "../firebase/auth/Authentication.js";
import { generateAccessAndRefreshToken } from "../firebase/auth/TokenHandler.js";
import {
  addUserToFirestore,
  bulkDeleteUserFromDatabase,
  deleteUserFromFireStore,
  getUserFromDatabase,
  updateUserDataInFirestore,
} from "../firebase/db/user.firestore.js";

import { DecodeToken, User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { CustomerType } from "../models/order.model.js";
import { json } from "express";

//Cookie options
const options = {
  httpOnly: true,
  secure: true,
};

const loginUser = asyncHandler(async (req: any, res: any) => {
  const {
    email,
    userRole,
  }: { email: string; userRole: "customer" | "admin" | "chef" } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  try {
    const user = await getUserDataByEmail(email);
    const userDataFromDatabase = await getUserFromDatabase(user.uid, userRole);
    const { role } = userDataFromDatabase;
    if (!user) throw new ApiError(404, "User doesn't exist.");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?.uid,
      role
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
    const userFromDatabase = await getUserFromDatabase(user.uid, user.role);
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

    const user = await getUserFromDatabase(
      decodedToken.uid.trim(),
      decodedToken.role
    );
    const { role } = user;
    if (!user) throw new ApiError(404, "User not found.");
    console.log(`User refresh token from database: \n${user.refreshToken}`);

    if (incomingRefreshToken !== user.refreshToken)
      throw new ApiError(403, "Refresh token is expired or used");

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user.uid, role);

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
    const foundUser = await getUserFromDatabase(user.uid, user.role);
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
    console.log(fullName, phoneNumber, avatar);
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as DecodeToken;

    const user = await getUserFromDatabase(decodedToken.uid, decodedToken.role);

    if (!fullName && !phoneNumber && !avatar)
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
          { fullName, phoneNumber, avatar },
          "Successfully updated user data.",
          true
        )
      );
  } catch (error) {
    throw new ApiError(400, "Error updating user in database.");
  }
});

const deletAllUser = asyncHandler(async (req: any, res: any) => {
  try {
    const {
      users,
      role,
    }: {
      users: CustomerType[];
      role: "customer" | "admin" | "chef";
    } = req.body;
    if (!users || users.length === 0) {
      throw new ApiError(404, "Users not found.");
    }
    const deletionPromises = users.map(async (user) => {
      const foundUser = await getUserFromDatabase(user.id, role);

      if (!foundUser) {
        throw new ApiError(404, `User with uid ${user.id} not found.`);
      }

      await deleteUserFromFireStore(foundUser.uid, foundUser.role);
    });

    await Promise.all(deletionPromises);
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "Users deleted successfully", true));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error; // Re-throw ApiError with custom message
    } else {
      throw new ApiError(400, "Error deleting users from firestore.");
    }
  }
});
const deleteUsersInBulk = asyncHandler(async (req: any, res: any) => {
  const {
    role,
    ids,
  }: {
    role: "customer" | "admin" | "chef";
    ids: string[];
  } = req.body;
  try {
    await bulkDeleteUserFromDatabase(role, ids);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Users deleted successfully.", true));
  } catch (error) {
    throw new ApiError(500, "Error while deleting users.");
  }
});

const updateUserRole = asyncHandler(async (req: any, res: any) => {
  const {
    id,
    role,
    newRole,
  }: {
    id: string;
    role: "customer" | "admin" | "chef";
    newRole: "customer" | "admin" | "chef";
  } = req.body;
  console.log(id, newRole);
  try {
    const user = await getUserFromDatabase(id, role);
    if (!user) throw new ApiError(404, "User not found.");
    await deleteUserFromFireStore(id, user.role);
    user.role = newRole;
    await addUserToFirestore(user, newRole);
    await generateAccessAndRefreshToken(id, newRole);
    console.log(user);
    return res
      .status(200)
      .json(
        new ApiResponse(200, user, "User's Role updated successfully.", true)
      );
  } catch (error) {
    throw new ApiError(500, "Error while updating user role.");
  }
});

export {
  loginUser,
  logOutUser,
  signUpNewUser,
  refreshAccessToken,
  deleteAccount,
  updateUser,
  deletAllUser,
  deleteUsersInBulk,
  updateUserRole,
};
