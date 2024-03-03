import express from "express";

export const AsyncHandler =
  (fn: any) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      res.status(error.code).json({
        success: false,
        message: error.message,
      });
    }
  };
