import { Router } from "express"; 
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addNewOrder,
  getAllOrdersFromDatabase,
  getOrderByUserIdFromDatabase,
} from "../controllers/order.controller.js";

const orderRoutes = Router();
orderRoutes.route("/all-orders").get(verifyJwt, getAllOrdersFromDatabase);
orderRoutes.route("/user-order").get(verifyJwt, getOrderByUserIdFromDatabase);
orderRoutes.route("/add-order").post(verifyJwt, addNewOrder)

export { orderRoutes };
 