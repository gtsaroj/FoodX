import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addNewCategory,
  getAllCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.route("/get-category").get(getAllCategory);
categoryRouter.route("/add-category").post(addNewCategory);
categoryRouter.route("/update-category").put(updateCategory);

export { categoryRouter };
