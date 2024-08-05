import { Router } from "express";
import {
  deleteAccount,
  deleteUser,
  deleteUsersInBulk,
  fetchUsers,
  logOutUser,
  loginUser,
  refreshAccessToken,
  signUpNewUser,
  updateAccount,
  updateUser,
  updateUserRole,
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
router.route("/get-users").get(fetchUsers);
router.route("/delete-account").delete(verifyJwt, deleteAccount);
router.route("/delete-user").delete(verifyJwt, verifyAdmin, deleteUser);
router.route("/update-account").post(verifyJwt, updateAccount);
router.route("/update-user").put(verifyJwt, verifyAdmin, updateUser);
router.route("/update-role").put(verifyJwt, verifyAdmin, updateUserRole);
router.route("/logout").post(verifyJwt, logOutUser);
router.route("/bulk-delete").delete(verifyJwt, verifyAdmin, deleteUsersInBulk);
export default router;
