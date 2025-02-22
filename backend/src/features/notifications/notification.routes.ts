import { Router } from "express";
import { verifyRoles } from "../../middlewares/auth/auth.middlewares.js";
import {
  addNotification,
  deleteNotification,
  fetchNotifications,
} from "./notification.controllers.js";

const notificationRouter = Router();

notificationRouter.post(
  "/add",
  verifyRoles(["admin", "chef", "customer"]),
  addNotification
);

notificationRouter.post(
  "/fetch",
  verifyRoles(["admin", "chef", "customer"]),
  fetchNotifications
);

notificationRouter.delete(
  "/remove",
  verifyRoles(["admin", "chef", "customer"]),
  deleteNotification
);

export { notificationRouter };
