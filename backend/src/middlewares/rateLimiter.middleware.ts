import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { redisClient } from "../utils/Redis.js";

const rateLimiter = (limitTime: number, limitRequestAmount: number) => {
  return asyncHandler(async (req: any, res: any, next: any) => {
    try {
      const ip =
        (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
        req.socket.remoteAddress;
      const response = await redisClient
        .multi()
        .incr(ip)
        .expire(ip, limitTime)
        .exec();
      if (response && (response[0] as number) > limitRequestAmount) {
        throw new ApiError(500, "Too many requests. Please try again later.");
      }
      next();
    } catch (error) {
      throw new ApiError(
        501,
        "Rate limit exceeded. Please try again later.",
        null,
        error as string[]
      );
    }
  });
};

export { rateLimiter };
