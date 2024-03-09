import { getUserDataByEmail } from "../firebase/Authentication.js";
import { generateAccessAndRefreshToken } from "../firebase/TokenHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const loginUser = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and Password is required");
  }

  try {
    //TODO: sign in

    const user = await getUserDataByEmail(email);
    if (!user) throw new ApiError(404, "User doesn't exist.");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?.uid
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

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

const logOutUser = asyncHandler(async (req: any, res: any) => {});

export { loginUser, logOutUser };
