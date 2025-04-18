import { APIError } from "../../helpers/error/ApiError.js";
import { OptGenerator } from "../../helpers/otp/otpGenerator.js";
import { redisClient } from "../../utils/cache/cache.js";
import { sendOTPEmail } from "../../utils/messaging/email.js";

export const resendOtp = async (
  uid: string,
  email: string,
  type: string
): Promise<void> => {
  try {
    const otp = OptGenerator();
    await redisClient.setEx(`${type}:${uid}`, 300, `${otp}`);
    await sendOTPEmail(email, `${otp}`);
  } catch (error) {
    throw new APIError("Error sending otp. " + error, 500);
  }
};
