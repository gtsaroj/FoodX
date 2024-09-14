import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addProduct,
  deleteProduct,
  deleteProductsInBulk,
  getNormalProducts,
  getPopularProducts,
  getProductByTag,
  getSpecialProducts,
  updateProduct,
} from "../controllers/products.controller.js";
import { verifyAdmin, verifyChef } from "../middlewares/role.middlewares.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";
import { cacheMiddleware } from "../middlewares/redis.middleware.js";

const productRouter = Router();

productRouter
  .route("/specials")
  .get(rateLimiter(60, 20), cacheMiddleware("specials"), getSpecialProducts);

productRouter
  .route("/popular")
  .get(
    rateLimiter(60, 20),
    cacheMiddleware("popular_products"),
    getPopularProducts
  );

productRouter
  .route("/add-product")
  .post(verifyJwt, verifyChef, rateLimiter(60, 20), addProduct);
productRouter
  .route("/update-product")
  .put(verifyJwt, verifyChef, rateLimiter(60, 20), updateProduct);
productRouter
  .route("/delete-product")
  .delete(verifyJwt, verifyChef, rateLimiter(60, 20), deleteProduct);

productRouter
  .route("/bulk-delete")
  .delete(verifyJwt, verifyAdmin, rateLimiter(60, 5), deleteProductsInBulk);
productRouter
  .route("/all")
  .get(rateLimiter(60, 20), cacheMiddleware("products"), getNormalProducts);

productRouter.route("/get-product-by-tag/:tag").get(
  rateLimiter(60, 20),
  (req, res, next) => {
    const tag = req?.params.tag;
    cacheMiddleware(`product:${tag}`)(req, res, next);
  },
  getProductByTag
);
export { productRouter };
