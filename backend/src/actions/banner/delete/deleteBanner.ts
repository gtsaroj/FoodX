import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const deleteBannerFromDatabase = async (
  id: string,
  collection: string
) => {
  const bannerRef = db.collection(collection);
  if (!bannerRef) throw new APIError("No banner collection found.", 404);
  try {
    await bannerRef.doc(id).delete();
    return collection;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to get banners from database. " + error, 500);
  }
};
