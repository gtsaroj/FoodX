import { db } from "../../../firebase/index.js";

export const deleteNotificationFromDatabase = async (id: string) => {
  const notificationRef = db.collection("notifications");
  if (!notificationRef) throw new Error("No notifications collection found.");
  try {
    await notificationRef.doc(id).delete();
  } catch (error) {
    throw new Error("Unable to get notifications from database. " + error);
  }
};
