import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const verifyAdmin = asyncHandler(async (req: any, _: any, next: any) => {
  try {
    const user = req.user as User;
    if (!user) throw new ApiError(404, "No user found while verifying admin");
    if (user.role !== "admin") throw new ApiError(403, "Unauthorized access.");
    next();
  } catch (error) {
    throw new ApiError(
      401,
      (error as string) || "Error while verifying admin."
    );
  }
});

export const verifyChef = asyncHandler(async (req: any, _: any, next: any) => {
  try {
    const user = req.user as User;
    if (!user) throw new ApiError(404, "No user found while verifying chef.");
    if (user.role === "customer")
      throw new ApiError(403, "Unauthorized access. Customers cannot access.");
    next();
  } catch (error) {
    throw new ApiError(
      401,
      (error as string) || "Error while verifying admin."
    );
  }
});
