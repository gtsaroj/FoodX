import { paginateFnc } from "../../../helpers/paginate/paginate.js";


export const getNotificationsFromDatabase = async (
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
    const notifications: Notification.NotificationDetail[] = [];

    notificationDoc.docs.forEach((doc) => {
      notifications.push(doc.data() as Notification.NotificationDetail);
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
    throw new Error("Error fetching notifications from database. " + error);
  }
};
