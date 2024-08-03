import { Router } from "express";
import {
  deletAllUser,
  deleteAccount,
  deleteUsersInBulk,
  logOutUser,
  loginUser,
  refreshAccessToken,
  signUpNewUser,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin } from "../middlewares/role.middlewares.js";

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
router.route("/refresh-token").post(refreshAccessToken);

// secured Routes
router.route("/delete-user").post(verifyJwt, deleteAccount);
router.route("/update-user").post(verifyJwt, updateUser);
router.route("/logout").post(verifyJwt, logOutUser);
router.route("/bulk-delete").delete(verifyJwt, verifyAdmin, deleteUsersInBulk);
export default router;
