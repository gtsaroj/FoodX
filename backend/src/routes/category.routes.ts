import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addNewCategory,
  deleteCategoriesInBulk,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.route("/get-category").get(verifyJwt, getAllCategory);
categoryRouter.route("/add-category").post(verifyJwt, addNewCategory);
categoryRouter.route("/update-category").put(verifyJwt, updateCategory);
categoryRouter.route("/delete-category").delete(verifyJwt, deleteCategory);
categoryRouter.route("/bulk-delete").delete(verifyJwt, deleteCategoriesInBulk);

export { categoryRouter };
