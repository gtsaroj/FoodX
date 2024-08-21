import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { redisClient } from "../utils/Redis.js";

const cacheMiddleware = (key: string) => {
  return asyncHandler(async (_: Request, res: Response, next: NextFunction) => {
    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              JSON.parse(cachedData),
              "Data from cache.",
              true
            )
          );
      } else {
        next();
      }
    } catch (error) {
      next(new ApiError(503, "Redis error.", null, error as string[]));
    }
  });
};

export { cacheMiddleware };
