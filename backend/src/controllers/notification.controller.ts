import {
  addNotificationToDatabase,
  bulkDeleteNotificationsFromDatabase,
  deleteNotificationFromDatabase,
  getNotificationsFromDatabase,
} from "../firebase/db/notification.firestore.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const addNotification = asyncHandler(async (req: any, res: any) => {
  const {
    userId,
    title,
    message,
  }: {
    userId: string;
    title: string;
    message: string;
  } = req.body;

  try {
    if (!userId || !title || !message)
      throw new ApiError(400, "Incomplete fields for notification.");
    await addNotificationToDatabase(userId, title, message);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          [],
          "Logs fetched successfully based on actions.",
          true
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Error adding notifications.",
          null,
          error as string[]
        )
      );
  }
});
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

  try {
    let { notifications, firstDoc, lastDoc, length } =
      await getNotificationsFromDatabase(
        pageSize,
        sort,
        direction === "next" ? currentLastDoc : null,
        direction === "prev" ? currentFirstDoc : null,
        direction,
        uid
      );
    res.status(200).json(
      new ApiResponse(
        200,
        {
          notifications,
          currentFirstDoc: firstDoc,
          currentLastDoc: lastDoc,
          length,
        },
        "Successfully fetched notifications from database",
        true
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Something went wrong while fetching notifications from database",
          null,
          error as string[]
        )
      );
  }
});

const deleteNotification = asyncHandler(async (req: any, res: any) => {
  const { id } = req.body;
  try {
    await deleteNotificationFromDatabase(id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, id, "Notification deleted successfully", true)
      );
  } catch (error) {
    throw new ApiError(
      501,
      "Error while deleting a notification.",
      null,
      error as string[],
      undefined,
      false
    );
  }
});
const deleteNotificationsInBulk = asyncHandler(async (req: any, res: any) => {
  const {
    ids,
  }: {
    ids: string[];
  } = req.body;
  try {
    await bulkDeleteNotificationsFromDatabase(ids);
    return res
      .status(200)
      .json(
        new ApiResponse(200, ids, "Notifications deleted successfully.", true)
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Error while deleting notifications.",
      null,
      error as string[],
      undefined,
      false
    );
  }
});

export {
  addNotification,
  deleteNotification,
  bulkDeleteNotificationsFromDatabase,
  fetchNotifications,
};
