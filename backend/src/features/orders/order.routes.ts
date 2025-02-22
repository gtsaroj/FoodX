import { Router } from "express";
import { verifyRoles } from "../../middlewares/auth/auth.middlewares.js";
import { rateLimiter } from "../../middlewares/rateLimiter/rateLimiter.middlewares.js";
import {
  addNewOrder,
  fetchOrders,
  searchOrderBasedOnUid,
  getOrderByUserIdFromDatabase,
  updateOrder,
} from "./order.controllers.js";
import { AddOrderSchema } from "../../utils/validate/order/add/addOrderSchema.js";
import { validateRequest } from "../../middlewares/validator/validator.middleware.js";
import { UpdateOrderSchema } from "../../utils/validate/order/update/updateOrderSchema.js";

const orderRoutes = Router();

orderRoutes.post(
  "/user-order",
  verifyRoles(["admin", "chef", "customer"]),
  getOrderByUserIdFromDatabase
);

orderRoutes.post(
  "/add",
  rateLimiter(60, 5),
  verifyRoles(["admin", "chef", "customer"]),
  validateRequest(AddOrderSchema),
  addNewOrder
);

orderRoutes.put(
  "/update",
  rateLimiter(60, 5),
  verifyRoles(["admin", "chef", "customer"]),
  validateRequest(UpdateOrderSchema),
  updateOrder
);

orderRoutes.post("/get-orders", verifyRoles(["chef", "admin"]), fetchOrders);

orderRoutes.post(
  "/find",
  verifyRoles(["admin", "chef"]),
  searchOrderBasedOnUid
);

export { orderRoutes };
