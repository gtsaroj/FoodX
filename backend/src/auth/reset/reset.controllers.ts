import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { OptGenerator } from "../../helpers/otp/otpGenerator.js";
import { redisClient } from "../../utils/cache/cache.js";
import { sendOTPEmail } from "../../utils/messaging/email.js";
import { getUserWithIdFromDatabase } from "../../actions/user/get/getUserWithId.js";
import { APIError } from "../../helpers/error/ApiError.js";

export const resetPasswordController = asyncHandler(
  async (
    req: Request<{ uid: string }, {}, {}, { role: User.RoleType }>,
    res: Response
  ) => {
    const { uid } = req.params;
    const { role } = req.query;

    if (!role) throw new APIError("Role is required.", 400);
    if (!uid) throw new APIError("User id is required.", 400);

    const user = await getUserWithIdFromDatabase(role, uid);
    const otp = OptGenerator();
    await redisClient.setEx(`reset:${uid}`, 300, `${otp}`);
    await sendOTPEmail(user.email, `${otp}`);

    const response: API.ApiResponse = {
      status: 200,
      success: true,
      data: [],
      message: "Password reset email sent successfully.",
    };
    res.status(200).json(response);
  }
);
