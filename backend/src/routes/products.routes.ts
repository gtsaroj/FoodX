import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  sendAllProducts,
  sendSpecialProducts,
} from "../controllers/products.controller.js";

const productRouter = Router();

//secured routes
productRouter.route("/all").get(verifyJwt, sendAllProducts);
productRouter.route("/specials").get(verifyJwt, sendSpecialProducts);

// admin-only secured routes

export { productRouter };
