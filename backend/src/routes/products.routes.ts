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
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";
import { cacheMiddleware } from "../middlewares/redis.middleware.js";

const productRouter = Router();

//routes for end users

/*
// productRouter
//   .route("/all")
//   .get(rateLimiter(60, 10), cacheMiddleware("products"), getNormalProducts);
*/

productRouter
  .route("/specials")
  .get(rateLimiter(60, 10), cacheMiddleware("specials"), getSpecialProducts);

productRouter.route("/get-product-by-tag/:tag").get(
  rateLimiter(60, 10),
  (req, res, next) => {
    const tag = req?.params.tag;
    cacheMiddleware(`product:${tag}`)(req, res, next);
  },
  getProductByTag
);

// secured routes for chef dashboard
productRouter
  .route("/add-product")
  .post(verifyJwt, verifyChef, rateLimiter(60, 20), addProducts);
productRouter
  .route("/update-product")
  .put(verifyJwt, verifyChef, rateLimiter(60, 20), updateProducts);
productRouter
  .route("/delete-product")
  .delete(verifyJwt, verifyChef, rateLimiter(60, 20), deleteProduct);
productRouter
  .route("/get-products")
  .post(verifyJwt, verifyChef, rateLimiter(60, 20), fetchProducts);

// secured route for admin only for bulk delete
productRouter
  .route("/bulk-delete")
  .delete(verifyJwt, verifyAdmin, rateLimiter(60, 5), deleteProductsInBulk);

export { productRouter };
