import jwt from "jsonwebtoken";
import {
  bulkDeleteUsersFromFirebase,
  deleteUserFromFirebase,
  getUserDataByEmail,
} from "../firebase/auth/userHandler.js";
import { generateAccessAndRefreshToken } from "../firebase/auth/TokenHandler.js";
import {
  addUserToFirestore,
  bulkDeleteUserFromDatabase,
  deleteUserFromFireStore,
  getUserFromDatabase,
  getUsersFromDatabase,
  searchUserInDatabase,
  updateUserDataInFirestore,
} from "../firebase/db/user.firestore.js";
import { DecodeToken, User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { OptGenerator } from "../utils/otpGenerator.js";
import { redisClient } from "../utils/Redis.js";
import { sendEmail } from "../utils/email.js";

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
          { user: userDataFromDatabase, accessToken, refreshToken },
          "User logged In Successfully",
          true
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, error as string[], `User login failed.`, false)
      );
  }
});

const signUpNewUser = asyncHandler(async (req: any, res: any) => {
  const { firstName, lastName, email, avatar, phoneNumber, role } = req.body;
  try {
    const user = await getUserDataByEmail(email);
    if (!user) throw new ApiError(404, "User not found.");
    const { uid } = user;

    const userInfo: User = {
      fullName: `${firstName} ${lastName}`,
      email,
      avatar,
      phoneNumber,
      uid,
      refreshToken: "",
      role,
      totalOrder: 0,
      totalSpent: 0,
    };

    const otp = await OptGenerator();
    redisClient.set(`otp:${uid}`, otp, { EX: 60 });
    await sendEmail(email, otp.toString());
    redisClient.set(`register_user:${uid}`, JSON.stringify(userInfo), {
      EX: 3600,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          uid,
          "User registered Successfully. Please verify your account.",
          true
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error as string[],
          "Error while adding new user in database.",
          false
        )
      );
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
    return res
      .status(500)
      .json(new ApiError(500, "Error logging out.", null, error as string[]));
  }
});

const refreshAccessToken = asyncHandler(async (req: any, res: any) => {
  const incomingRefreshToken: string =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized access");

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as DecodeToken;

    const user = await getUserFromDatabase(
      decodedToken.uid.trim(),
      decodedToken.role
    );
    const { role } = user;
    if (!user) throw new ApiError(404, "User not found.");

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

    user.refreshToken = newRefreshToken;

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
    return res
      .status(403)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(
        new ApiResponse(
          403,
          error as string[],
          "Error  on refreshing the Access Token",
          false
        )
      );
  }
});

const updateAccount = asyncHandler(async (req: any, res: any) => {
  try {
    const { fullName, phoneNumber, avatar } = req.body;
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
    const updatedUser = await getUserFromDatabase(user.uid, user.role);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedUser },
          "Successfully updated user data.",
          true
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error as string[],
          "Error updating user in database.",
          false
        )
      );
  }
});

const updateUser = asyncHandler(async (req: any, res: any) => {
  const { id, role, fullName, phoneNumber, avatar } = req.body;
  try {
    if (!id || !role)
      throw new ApiError(
        400,
        "User id and role is required to update user data."
      );
    if (!fullName && !phoneNumber && !avatar)
      throw new ApiError(400, "No data provided to update.");

    if (fullName) {
      await updateUserDataInFirestore(id, role, "fullName", fullName);
    }

    if (phoneNumber) {
      await updateUserDataInFirestore(id, role, "phoneNumber", phoneNumber);
    }

    if (avatar) {
      await updateUserDataInFirestore(id, role, "avatar", avatar);
    }

    const updatedUser = await getUserFromDatabase(id, role);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedUser },
          "Successfully updated user data.",
          true
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error as string[],
          "Error while updating user data.",
          false
        )
      );
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
  try {
    const user = await getUserFromDatabase(id, role);
    if (!user) throw new ApiError(404, "User not found.");
    await deleteUserFromFireStore(id, user.role);
    user.role = newRole;
    await addUserToFirestore(user, newRole);
    await generateAccessAndRefreshToken(id, newRole);
    return res
      .status(200)
      .json(
        new ApiResponse(200, user, "User's Role updated successfully.", true)
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error as string[],
          "Error while updating user role.",
          false
        )
      );
  }
});

const getUser = asyncHandler(async (req: any, res: any) => {
  const role = req.params.role;
  const userId = req.query.userId;
  try {
    const user = await getUserFromDatabase(userId, role);
    if (!user) throw new ApiError(404, "User not found.");
    return res
      .status(200)
      .json(
        new ApiResponse(200, user, "User data fetched successfully.", true)
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error as string[],
          "Something went wrong while fetching user information.",
          false
        )
      );
  }
});

const fetchUsers = asyncHandler(async (req: any, res: any) => {
  let {
    path,
    pageSize,
    filter,
    sort,
    direction,
    currentFirstDoc,
    currentLastDoc,
  }: {
    path: "customer" | "admin" | "chef";
    pageSize: number;
    filter: keyof User;
    sort: "asc" | "desc";
    direction: "prev" | "next";
    currentFirstDoc: any | null;
    currentLastDoc: any | null;
  } = req.body;

  try {
    let { users, firstDoc, lastDoc, length } = await getUsersFromDatabase(
      path,
      pageSize,
      filter,
      sort,
      direction === "next" ? currentLastDoc : null,
      direction === "prev" ? currentFirstDoc : null,
      direction
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { users, currentFirstDoc: firstDoc, currentLastDoc: lastDoc, length },
          "Successfully fetched users from database",
          true
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error as string[],
          "Something went wrong while fetching users from database",
          false
        )
      );
  }
});

const deleteAccount = asyncHandler(async (req: any, res: any) => {
  try {
    const user = req.user as User;
    const foundUser = await getUserFromDatabase(user.uid, user.role);
    if (!foundUser) throw new ApiError(404, "User not found.");

    await deleteUserFromFireStore(foundUser.uid, foundUser.role);
    await deleteUserFromFirebase(foundUser.uid);
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User deleted successfully", true));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error deleting user from firestore."));
  }
});

const deleteUser = asyncHandler(async (req: any, res: any) => {
  try {
    const { uid, role }: { uid: string; role: "customer" | "chef" | "admin" } =
      req.body;
    const foundUser = await getUserFromDatabase(uid, role);
    if (!foundUser) throw new ApiError(404, "User not found.");

    await deleteUserFromFireStore(foundUser.uid, foundUser.role);
    await deleteUserFromFirebase(foundUser.uid);
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User deleted successfully", true));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error as string[],
          "Error deleting user from firestore.",
          false
        )
      );
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
    const deletedUsers = await bulkDeleteUsersFromFirebase(ids);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { deletedUsers },
          "Users deleted successfully.",
          true
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error as string[],
          "Error while deleting users.",
          false
        )
      );
  }
});

const getSearchUser = asyncHandler(async (req: any, res: any) => {
  const search = req.query.search;
  try {
    if (!search) return;
    const users = await searchUserInDatabase(search);
    return res
      .status(200)
      .json(
        new ApiResponse(200, users, "All products fetched successfully.", true)
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error as string[],
          "Unable to fetch user information.",
          false
        )
      );
  }
});

export {
  loginUser,
  logOutUser,
  signUpNewUser,
  refreshAccessToken,
  deleteAccount,
  updateAccount,
  updateUser,
  updateUserRole,
  deleteUser,
  deleteUsersInBulk,
  fetchUsers,
  getUser,
  getSearchUser,
};
