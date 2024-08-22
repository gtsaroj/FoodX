import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addNewCategory,
  deleteCategoriesInBulk,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import { verifyChef } from "../middlewares/role.middlewares.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";
import { cacheMiddleware } from "../middlewares/redis.middleware.js";

const categoryRouter = Router();

//for end users
categoryRouter
  .route("/get-category")
  .get(rateLimiter(60, 10), cacheMiddleware("category"), getAllCategory);

//for chef dashboard
categoryRouter
  .route("/add-category")
  .post(verifyJwt, verifyChef, rateLimiter(60, 20), addNewCategory);
categoryRouter
  .route("/update-category")
  .put(verifyJwt, verifyChef, rateLimiter(60, 10), updateCategory);
categoryRouter
  .route("/delete-category")
  .delete(verifyJwt, verifyChef, rateLimiter(60, 10), deleteCategory);
categoryRouter
  .route("/bulk-delete")
  .delete(verifyJwt, verifyChef, rateLimiter(60, 5), deleteCategoriesInBulk);

export { categoryRouter };
