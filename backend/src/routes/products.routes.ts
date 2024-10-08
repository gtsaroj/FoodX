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
  .get(cacheMiddleware("specials"), getSpecialProducts);

productRouter
  .route("/popular")
  .get(
    cacheMiddleware("popular_products"),
    rateLimiter(60, 20),
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
productRouter.route("/all").get(cacheMiddleware("products"), getNormalProducts);

productRouter.route("/get-product-by-tag/:tag").get((req, res, next) => {
  const tag = req?.params.tag;
  cacheMiddleware(`product:${tag}`)(req, res, next);
}, getProductByTag);
export { productRouter };
