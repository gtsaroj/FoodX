import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addNewOrder,
  fetchOrders,
  updateOrder,
  getOrderByUserIdFromDatabase,
} from "../controllers/order.controller.js";
import { verifyChef } from "../middlewares/role.middlewares.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";

const orderRoutes = Router();
orderRoutes.route("/user-order").post(verifyJwt, getOrderByUserIdFromDatabase);
orderRoutes
  .route("/add-order")
  .post(rateLimiter(60, 5), verifyJwt, addNewOrder);
orderRoutes.route("/update-order").put(verifyJwt, updateOrder);
orderRoutes.route("/get-orders").post(verifyJwt, verifyChef, fetchOrders);

export { orderRoutes };
