import { FieldValue } from "firebase-admin/firestore";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";
import { NotificationDetail } from "../../models/notification.model.js";
import { paginateFnc } from "../utils.js";

const addNotificationToDatabase = async (
  uid: string,
  title: string,
  message: string
) => {
  const notificationRef = db.collection("notifications");
  if (!notificationRef)
    throw new ApiError(404, "No notifications collection found.");
  try {
    const notifications = await notificationRef
      .add({
        id: "",
        title,
        uid,
        message,
      })
      .then((docRef) =>
        docRef.update({
          id: docRef.id,
          createdAt: FieldValue.serverTimestamp(),
        })
      );
    return notifications;
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to add notification in database.",
      null,
      error as string[]
    );
  }
};
// const getNotificationsFromDatabase = async (uid: string) => {
//   const notificationRef = db
//     .collection("notifications")
//     .where("uid", "==", uid)
//     .orderBy("date", "desc");
//   if (!notificationRef) throw new ApiError(404, "No banner collection found.");

//   try {
//     const notificationsDoc = await notificationRef.get();
//     let notifications: NotificationDetail[] = [];
//     if (notificationsDoc.empty)
//       throw new ApiError(404, "No notifications found.");
//     notificationsDoc.forEach((doc) => {
//       const data = doc.data() as NotificationDetail;
//       notifications.push(data);
//     });
//     return notifications;
//   } catch (error) {
//     throw new ApiError(
//       500,
//       "Unable to get notifications from database.",
//       null,
//       error as string[]
//     );
//   }
// };

const deleteNotificationFromDatabase = async (id: string) => {
  const notificationRef = db.collection("notifications");
  if (!notificationRef)
    throw new ApiError(404, "No notifications collection found.");
  try {
    await notificationRef.doc(id).delete();
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to get notifications from database.",
      null,
      error as string[]
    );
  }
};

const bulkDeleteNotificationsFromDatabase = async (id: string[]) => {
  const notificationRef = db.collection("notifications");
  if (!notificationRef)
    throw new ApiError(404, "No notifications collection available.");
  try {
    const batch = db.batch();

    id.forEach((notificationId) => {
      const docRef = notificationRef.doc(notificationId);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    throw new ApiError(
      401,
      "Unable to bulk delete notifications from database.",
      null,
      error as string[]
    );
  }
};

const getNotificationsFromDatabase = async (
  pageSize: number,
  sort: "asc" | "desc" = "desc",
  startAfterDoc: any | null = null,
  startAtDoc: any | null = null,
  direction?: "prev" | "next",
  uid?: string
) => {
  try {
    const { query, totalLength } = await paginateFnc(
      "notifications",
      "createdAt",
      startAfterDoc,
      startAtDoc,
      pageSize,
      sort,
      direction,
      uid
    );
    const notificationDoc = await query.get();
    const notifications: NotificationDetail[] = [];

    notificationDoc.docs.forEach((doc) => {
      notifications.push(doc.data() as NotificationDetail);
    });

    const firstDoc = notificationDoc.docs[0]?.data().id || null;
    const lastDoc =
      notificationDoc.docs[notificationDoc.docs.length - 1]?.data().id || null;
    return {
      notifications,
      firstDoc,
      lastDoc,
      length: totalLength,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Error fetching notifications from database.",
      null,
      error as string[]
    );
  }
};

export {
  addNotificationToDatabase,
  getNotificationsFromDatabase,
  deleteNotificationFromDatabase,
  bulkDeleteNotificationsFromDatabase,
};
