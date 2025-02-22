import { db } from "../../../firebase/index.js";

export const bulkDeleteUserFromDatabase = async (
  path: "customer" | "admin" | "chef",
  id: string[]
) => {
  const userRef = db.collection(path);
  if (!userRef) throw new Error("No collection available.");
  try {
    const batch = db.batch();

    id.forEach((userId) => {
      const docRef = userRef.doc(userId);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    throw new Error("Unable to bulk delete users data.");
  }
};
