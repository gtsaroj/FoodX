import { getUserDataByEmail } from "../firebase/auth/Authentication.js";
import { generateAccessAndRefreshToken } from "../firebase/auth/TokenHandler.js";
import { addUserToFirestore } from "../firebase/db/user.firestore.js";
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


    //TODO: send privilage value somehow from frontend or firebase and store accordingly.
    await addUserToFirestore(
      { ...user, refreshToken },
      { privilage: "customers" }
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

const logOutUser = asyncHandler(async (_: any, res: any) => {
  try {
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully", true));
  } catch (error) {
    throw new ApiError(400, "Error logging out.");
  }
});

export { loginUser, logOutUser };
