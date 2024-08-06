import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addProducts,
  deleteProduct,
  deleteProductsInBulk,
  fetchProducts,
  getNormalProducts,
  getProductByTag,
  getSpecialProducts,
  updateProducts,
} from "../controllers/products.controller.js";
import { verifyAdmin, verifyChef } from "../middlewares/role.middlewares.js";

const productRouter = Router();

//secured routes
productRouter.route("/all").get(verifyJwt, getNormalProducts);
productRouter.route("/specials").get(verifyJwt, getSpecialProducts);
productRouter.route("/add-product").post(verifyJwt, verifyChef, addProducts);
productRouter.route("/get-product-by-tag").get(verifyJwt, getProductByTag);
productRouter
  .route("/update-product")
  .put(verifyJwt, verifyChef, updateProducts);
productRouter
  .route("/delete-product")
  .delete(verifyJwt, verifyAdmin, deleteProduct);
productRouter
  .route("/bulk-delete")
  .delete(verifyJwt, verifyAdmin, deleteProductsInBulk);
productRouter.route("/get-products").post(verifyJwt, verifyChef, fetchProducts);

export { productRouter };
