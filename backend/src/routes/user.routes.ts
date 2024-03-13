import { Router } from "express";
import {
  logOutUser,
  loginUser,
  signUpNewUser,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.route("/login").post(loginUser);
router.route("/signIn").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  signUpNewUser
);
router.route("/logout").post(verifyJwt, logOutUser);

export default router;
