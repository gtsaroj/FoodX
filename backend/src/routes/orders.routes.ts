import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addNewOrder,
  fetchOrders,
  getAllOrdersFromDatabase,
  getOrderByUserIdFromDatabase,
  updateOrder,
} from "../controllers/order.controller.js";
import { verifyChef } from "../middlewares/role.middlewares.js";
import { cacheListMiddleware } from "../middlewares/redis.middleware.js";

const orderRoutes = Router();
orderRoutes.route("/all-orders").get(verifyJwt, getAllOrdersFromDatabase);
orderRoutes
  .route("/user-order")
  .post(
    verifyJwt,
    cacheListMiddleware("latest_orders", 0, -1),
    getOrderByUserIdFromDatabase
  );
orderRoutes.route("/add-order").post(verifyJwt, addNewOrder);
orderRoutes.route("/update-order").put(verifyJwt, updateOrder);
orderRoutes
  .route("/get-orders")
  .post(
    verifyJwt,
    verifyChef,
    cacheListMiddleware("fetched_orders", 0, -1),
    fetchOrders
  );

export { orderRoutes };
