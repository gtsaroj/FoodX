import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { resendOtp } from "./resend.services.js";

export const resendOtpController = asyncHandler(
  async (
    req: Request<{}, {}, { uid: string; email: string; type: string }>,
    res: Response
  ) => {
    const { uid, email, type } = req.body;
    let response: API.ApiResponse;
    await resendOtp(uid, email, type);
    response = {
      data: {},
      message: "OTP sent successfully.",
      success: true,
      status: 200,
    };
    return res.status(200).json(response);
  }
);
