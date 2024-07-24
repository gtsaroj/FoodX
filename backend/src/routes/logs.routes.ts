import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addLogs,
  getLogsBasedOnAction,
  getLogsBasedOnRoles,
} from "../controllers/logs.controller.js";

const logRouter = Router();

logRouter.route("/get-role-logs").get(verifyJwt, getLogsBasedOnRoles);
logRouter.route("/get-action-logs").get(verifyJwt, getLogsBasedOnAction);
logRouter.route("/add-logs").post(verifyJwt, addLogs);

export { logRouter };
