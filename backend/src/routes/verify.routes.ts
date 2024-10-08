import { Router } from "express";
import { verifyOtp } from "../controllers/verify.controller.js";

const verifyRouter = Router();
verifyRouter.route("/verify").post(verifyOtp);

export { verifyRouter };
