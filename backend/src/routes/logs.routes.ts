import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addLogs,
  fetchLogs,
  getLogsBasedOnAction,
  getLogsBasedOnRoles,
} from "../controllers/logs.controller.js";
import { verifyAdmin } from "../middlewares/role.middlewares.js";

const logRouter = Router();

logRouter
  .route("/get-role-logs")
  .get(verifyJwt, verifyAdmin, getLogsBasedOnRoles);
logRouter
  .route("/get-action-logs")
  .get(verifyJwt, verifyAdmin, getLogsBasedOnAction);
logRouter.route("/add-logs").post(verifyJwt, addLogs);
logRouter.route("/get-logs").post(verifyJwt, verifyAdmin, fetchLogs);

export { logRouter };
