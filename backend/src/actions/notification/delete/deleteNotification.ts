import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const deleteNotificationFromDatabase = async (id: string) => {
  const notificationRef = db.collection("notifications");
  if (!notificationRef)
    throw new APIError("No notifications collection found.", 404);
  try {
    await notificationRef.doc(id).delete();
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Unable to get notifications from database. " + error,
      500
    );
  }
};
