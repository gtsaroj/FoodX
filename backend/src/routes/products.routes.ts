import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addProducts,
  sendAllProducts,
  sendSpecialProducts,
} from "../controllers/products.controller.js";

const productRouter = Router();

//secured routes
productRouter.route("/all").get(verifyJwt, sendAllProducts);
productRouter.route("/specials").get(verifyJwt, sendSpecialProducts);
productRouter.route("/add-product").post(verifyJwt, addProducts);

// admin-only secured routes

export { productRouter };
