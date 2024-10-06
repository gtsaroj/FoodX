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

categoryRouter
  .route("/get-category")
  .get(cacheMiddleware("category"), getAllCategory);

categoryRouter
  .route("/add-category")
  .post(rateLimiter(60, 30), verifyJwt, verifyChef, addNewCategory);
categoryRouter
  .route("/update-category")
  .put(rateLimiter(60, 50), verifyJwt, verifyChef, updateCategory);
categoryRouter
  .route("/delete-category")
  .delete(rateLimiter(60, 15), verifyJwt, verifyChef, deleteCategory);
categoryRouter
  .route("/bulk-delete")
  .delete(rateLimiter(60, 10), verifyJwt, verifyChef, deleteCategoriesInBulk);

export { categoryRouter };
