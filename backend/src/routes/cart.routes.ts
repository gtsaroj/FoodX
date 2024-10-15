import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";
import {
  addCarts,
  removeCarts,
  getCarts,
} from "../controllers/carts.controller.js";

const cartRouter = Router();

cartRouter.route("/add").post(rateLimiter(60, 30), verifyJwt, addCarts);
cartRouter.route("/remove").delete(rateLimiter(60, 20), verifyJwt, removeCarts);
cartRouter.route("/:uid").get(verifyJwt, getCarts);

export default cartRouter;
