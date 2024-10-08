import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addNotification,
  bulkDeleteNotificationsFromDatabase,
  deleteNotification,
  fetchNotifications,
} from "../controllers/notification.controller.js";

const notificationRouter = Router();

notificationRouter.route("/add").post(verifyJwt, addNotification);
notificationRouter.route("/fetch").post(verifyJwt, fetchNotifications);
notificationRouter.route("/delete").delete(verifyJwt, deleteNotification);
notificationRouter
  .route("/bulk-delete")
  .delete(verifyJwt, bulkDeleteNotificationsFromDatabase);

export { notificationRouter };
