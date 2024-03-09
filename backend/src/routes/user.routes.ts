import { Router } from "express";
import { logOutUser, loginUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const router = Router();
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logOutUser);

export default router;
