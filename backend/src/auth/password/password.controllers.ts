import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { ChangePasswordSchemaType } from "../../utils/validate/auth/changePasswordSchema.js";
import { ChangePasswordService } from "./password.services.js";

export const ChangePassword = asyncHandler(
  async (req: Request<{}, {}, ChangePasswordSchemaType>, res: Response) => {
    const { newPassword, oldPassword, uid, role } = req.body;
    let response: API.ApiResponse;

    await ChangePasswordService({ newPassword, oldPassword, uid, role });
    response = {
      data: [],
      message: "Password changed successfully.",
      success: true,
      status: 200,
    };

    return res.status(200).json(response);
  }
);
