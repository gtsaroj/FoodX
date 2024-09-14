import { Router } from "express";
import {
  deleteAccount,
  deleteUser,
  deleteUsersInBulk,
  fetchUsers,
  getSearchUser,
  getUser,
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
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.route("/login").post(rateLimiter(60, 10), loginUser);
router.route("/signIn").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  rateLimiter(30, 3),
  signUpNewUser
);
router.route("/find").get(verifyJwt, verifyAdmin, getSearchUser);
router.route("/:role").get(rateLimiter(60, 5), getUser);
router.route("/refresh-token").post(rateLimiter(60, 5), refreshAccessToken);
router
  .route("/delete-account")
  .delete(verifyJwt, rateLimiter(60, 5), deleteAccount);
router
  .route("/update-account")
  .post(verifyJwt, rateLimiter(60, 10), updateAccount);
router.route("/logout").post(verifyJwt, rateLimiter(60, 10), logOutUser);

router
  .route("/get-users")
  .post(verifyJwt, verifyAdmin, rateLimiter(60, 10), fetchUsers);
router
  .route("/delete-user")
  .delete(verifyJwt, verifyAdmin, rateLimiter(60, 10), deleteUser);
router
  .route("/update-user")
  .put(verifyJwt, verifyAdmin, rateLimiter(60, 5), updateUser);
router
  .route("/update-role")
  .put(verifyJwt, verifyAdmin, rateLimiter(60, 5), updateUserRole);
router
  .route("/bulk-delete")
  .delete(verifyJwt, verifyAdmin, rateLimiter(60, 5), deleteUsersInBulk);
export default router;
