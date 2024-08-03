import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addNewOrder,
  getAllOrdersFromDatabase,
  getOrderByUserIdFromDatabase,
  updateOrder,
} from "../controllers/order.controller.js";

const orderRoutes = Router();
orderRoutes.route("/all-orders").get(verifyJwt, getAllOrdersFromDatabase);
orderRoutes.route("/user-order").post(verifyJwt, getOrderByUserIdFromDatabase);
orderRoutes.route("/add-order").post(verifyJwt, addNewOrder);
orderRoutes.route("/update-order").put(verifyJwt, updateOrder);

export { orderRoutes };
