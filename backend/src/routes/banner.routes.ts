import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addNewBanner,
  deleteBanner,
  deleteBannersInBulk,
  getAllBanners,
} from "../controllers/banner.controller.js";

const bannerRouter = Router();

bannerRouter.route("/get-banners").get(verifyJwt, getAllBanners);
bannerRouter.route("/add-banner").post(verifyJwt, addNewBanner);
bannerRouter.route("/delete-banner").delete(verifyJwt, deleteBanner);
bannerRouter.route("/bulk-delete").delete(verifyJwt, deleteBannersInBulk);

export { bannerRouter };
