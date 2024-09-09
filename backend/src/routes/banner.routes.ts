import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addNewBanner,
  deleteBanner,
  deleteBannersInBulk,
  getAllBanners,
} from "../controllers/banner.controller.js";
import { verifyChef } from "../middlewares/role.middlewares.js";
import { cacheMiddleware } from "../middlewares/redis.middleware.js";

const bannerRouter = Router();

bannerRouter
  .route("/:path")
  .get(cacheMiddleware("banner"), getAllBanners);
bannerRouter.route("/add-banner").post(verifyJwt, verifyChef, addNewBanner);
bannerRouter
  .route("/delete-banner")
  .delete(verifyJwt, verifyChef, deleteBanner);
bannerRouter
  .route("/bulk-delete")
  .delete(verifyJwt, verifyChef, deleteBannersInBulk);

export { bannerRouter };
