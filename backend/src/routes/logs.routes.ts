import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addLogs,
  fetchLogs,
} from "../controllers/logs.controller.js";
import { verifyAdmin } from "../middlewares/role.middlewares.js";

const logRouter = Router();

logRouter.route("/add-logs").post(verifyJwt, addLogs);
logRouter.route("/get-logs").post(verifyJwt, verifyAdmin, fetchLogs);

export { logRouter };
