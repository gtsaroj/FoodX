import { db } from "../../../firebase/index.js";

export const deleteBannerFromDatabase = async (
  id: string,
  collection: string
) => {
  const bannerRef = db.collection(collection);
  if (!bannerRef) throw new Error("No banner collection found.");
  try {
    await bannerRef.doc(id).delete();
    return collection;
  } catch (error) {
    throw new Error("Unable to get banners from database. " + error);
  }
};
