import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { verifyChef } from "../middlewares/role.middlewares.js";
import {
  addRevenueData,
  fetchRevenue,
} from "../controllers/revenue.controller.js";

const revenueRouter = Router();
revenueRouter.route("/get-revenue").post(verifyJwt, verifyChef, fetchRevenue);
revenueRouter.route("/add-revenue").post(verifyJwt, addRevenueData);
export { revenueRouter };
