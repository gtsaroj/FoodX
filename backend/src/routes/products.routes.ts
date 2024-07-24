import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addProducts,
  getNormalProducts,
  getProductByTag,
  getSpecialProducts,
  updateProducts,
} from "../controllers/products.controller.js";

const productRouter = Router();

//secured routes
productRouter.route("/all").get(verifyJwt, getNormalProducts);
productRouter.route("/specials").get(verifyJwt, getSpecialProducts);
productRouter.route("/add-product").post(verifyJwt, addProducts);
productRouter.route("/get-product-by-tag").get(verifyJwt, getProductByTag);
productRouter.route("/update-product").put(verifyJwt, updateProducts);

// admin-only secured routes

export { productRouter };
