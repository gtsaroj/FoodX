import { Request, Response } from "express";
import { addNotificationToDatabase } from "../../actions/notification/add/addNotification.js";
import { deleteNotificationFromDatabase } from "../../actions/notification/delete/deleteNotification.js";
import { getNotificationsFromDatabase } from "../../actions/notification/get/getNotifications.js";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { APIError } from "../../helpers/error/ApiError.js";

const addNotification = asyncHandler(
  async (
    req: Request<
      {},
      {},
      {
        uid: string;
        title: string;
        message: string;
      }
    >,
    res: Response
  ) => {
    const { uid, title, message } = req.body;

    if (!uid || !title || !message)
      throw new APIError("Incomplete fields for notification.", 400);

    await addNotificationToDatabase(uid, title, message);

    const response: API.ApiResponse = {
      status: 201,
      data: [],
      message: "Notification added successfully",
      success: true,
    };
    return res.status(201).json(response);
  }
);

const fetchNotifications = asyncHandler(async (req: any, res: any) => {
  let {
    pageSize,
    sort,
    direction,
    currentFirstDoc,
    currentLastDoc,
    uid,
  }: {
    pageSize: number;
    sort: "asc" | "desc";
    currentFirstDoc: any | null;
    currentLastDoc: any | null;
    direction?: "prev" | "next";
    uid: string;
  } = req.body;

  let response: API.ApiResponse;
  let { notifications, firstDoc, lastDoc, length } =
    await getNotificationsFromDatabase(
      pageSize,
      sort,
      direction === "next" ? currentLastDoc : null,
      direction === "prev" ? currentFirstDoc : null,
      direction,
      uid
    );
  response = {
    status: 200,
    data: {
      notifications,
      currentFirstDoc: firstDoc,
      currentLastDoc: lastDoc,
      length,
    },
    message: "Successfully fetched notifications from database",
    success: true,
  };
  return res.status(200).json(response);
});

const deleteNotification = asyncHandler(
  async (req: Request<{}, {}, { id: string }>, res: Response) => {
    const { id } = req.body;
    if (!id) throw new APIError("Notification ID is required.", 400);

    await deleteNotificationFromDatabase(id);
    const response: API.ApiResponse = {
      status: 200,
      data: id,
      message: "Notification deleted successfully",
      success: true,
    };
    return res.status(200).json(response);
  }
);

export { addNotification, deleteNotification, fetchNotifications };
