import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { redisClient } from "../utils/Redis.js";

const rateLimiter = (limitTime: number, limitRequestAmount: number) => {
  return asyncHandler(async (req: Request, _: Response, next: NextFunction) => {
    try {
      const ip =
        req.ip ||
        ((req.headers["x-forwarded-for"] as string) || "")
          .split(",")
          .shift()
          ?.trim() ||
        req.socket.remoteAddress;

      const endpoint = req.originalUrl;
      const key = `${ip}:${endpoint}`;
      const response = await redisClient
        .multi()
        .incr(key)
        .expire(key, limitTime)
        .exec();
      if (response && (response[0] as number) > limitRequestAmount) {
        throw new ApiError(500, "Too many requests. Please try again later.");
      }
      next();
    } catch (error) {
      new ApiError(
        501,
        "Rate limit exceeded. Please try again later.",
        null,
        error as string[]
      );
    }
  });
};

export { rateLimiter };
