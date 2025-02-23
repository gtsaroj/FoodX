import { db } from "../../../firebase/index.js";

export const bulkDeleteNotificationsFromDatabase = async (id: string[]) => {
  const notificationRef = db.collection("notifications");
  if (!notificationRef)
    throw new Error("No notifications collection available.");
  try {
    const batch = db.batch();

    id.forEach((notificationId) => {
      const docRef = notificationRef.doc(notificationId);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    throw new Error(
      "Unable to bulk delete notifications from database. " + error
    );
  }
};
