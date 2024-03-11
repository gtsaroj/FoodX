import { Router } from "express";
import { logOutUser, loginUser, signUpNewUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const router = Router();
router.route("/login").post(loginUser);
router.route("/signIn").post(signUpNewUser)
router.route("/logout").post(verifyJwt, logOutUser);

export default router;
