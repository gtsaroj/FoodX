import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { redisClient } from "../utils/Redis.js";

export const verifyOtp = asyncHandler(async (req: any, res: any) => {
  const { code } = req.body;
  try {
    const data = redisClient.get("otp");
    if (!data) {
      return res.status(404).json(new ApiError(404, "OTP not found."));
    }
    if (data && +data === +code) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "OTP verified successfully.", true));
    } else {
      return res.status(400).json(new ApiError(400, "Invalid otp."));
    }
  } catch (error) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Error verifying otp.",
          null,
          error as string[],
          undefined,
          false
        )
      );
  }
});
