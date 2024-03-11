import { getUserDataByEmail } from "../firebase/auth/Authentication.js";
import { generateAccessAndRefreshToken } from "../firebase/auth/TokenHandler.js";
import {
  addUserToFirestore,
  updateUserDataInFirestore,
} from "../firebase/db/user.firestore.js";
import { User } from "../models/user.model.js";
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
    if (!user) throw new ApiError(404, "User doesn't exist.");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?.uid
    );
    user.refreshToken = refreshToken;

    //TODO: send privilage value somehow from frontend or firebase and store accordingly.
    await updateUserDataInFirestore(
      user.uid,
      { privilage: "customers" },
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
  const { firstName, lastName, email, avatar, phoneNumber } = req.body;
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
    };

    await addUserToFirestore(userInfo, { privilage: "customers" });
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

    await updateUserDataInFirestore(
      user.uid,
      { privilage: "customers" },
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

export { loginUser, logOutUser, signUpNewUser };
