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

const categoryRouter = Router();

categoryRouter
  .route("/get-category")
  .get(verifyJwt, verifyChef, getAllCategory);
categoryRouter
  .route("/add-category")
  .post(verifyJwt, verifyChef, addNewCategory);
categoryRouter
  .route("/update-category")
  .put(verifyJwt, verifyChef, updateCategory);
categoryRouter
  .route("/delete-category")
  .delete(verifyJwt, verifyChef, deleteCategory);
categoryRouter
  .route("/bulk-delete")
  .delete(verifyJwt, verifyChef, deleteCategoriesInBulk);

export { categoryRouter };
