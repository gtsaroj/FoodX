import { db } from "../../../firebase/index.js";

export const bulkDeleteBannersFromDatabase = async (
  id: string[],
  collection: string
) => {
  const bannerRef = db.collection("banners");
  if (!bannerRef) throw new Error("No banners collection available.");
  try {
    const batch = db.batch();

    id.forEach((bannerId) => {
      const docRef = bannerRef.doc(bannerId);
      batch.delete(docRef);
    });
    await batch.commit();
    return collection;
  } catch (error) {
    throw new Error("Unable to bulk delete banners from database. " + error);
  }
};
