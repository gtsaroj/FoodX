import { Banner } from "../../models/banner.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";

const addBannerToFirestore = async (title: string, image: string) => {
  const bannerRef = db.collection("banners");
  if (!bannerRef) throw new ApiError(404, "No banner collection found.");
  try {
    const banner = await bannerRef
      .add({
        id: "",
        title,
        image,
        date: new Date(),
      })
      .then((docRef) => docRef.update({ id: docRef.id }));
    return banner;
  } catch (error) {
    throw new ApiError(501, "Unable to add banner in database.");
  }
};
const getBannersFromDatabase = async () => {
  const bannerRef = db.collection("banners");
  if (!bannerRef) throw new ApiError(404, "No banner collection found.");

  try {
    const bannerDocs = await bannerRef.get();
    let banners: Banner[] = [];
    if (bannerDocs.empty) throw new ApiError(404, "No banners found.");
    bannerDocs.forEach((doc) => {
      const data = doc.data() as Banner;
      banners.push(data);
    });
    return banners;
  } catch (error) {
    throw new ApiError(501, "Unable to get banners from database.");
  }
};

const deleteBannerFromDatabase = async (id: string) => {
  const bannerRef = db.collection("banners");
  if (!bannerRef) throw new ApiError(404, "No banner collection found.");
  try {
    await bannerRef.doc(id).delete();
  } catch (error) {
    throw new ApiError(501, "Unable to get banners from database.");
  }
};

const bulkDeleteBannersFromDatabase = async (id: string[]) => {
  const bannerRef = db.collection("banners");
  if (!bannerRef) throw new ApiError(404, "No banners collection available.");
  try {
    const batch = db.batch();

    id.forEach((bannerId) => {
      const docRef = bannerRef.doc(bannerId);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    throw new ApiError(401, "Unable to bulk delete banners from database.");
  }
};

export {
  addBannerToFirestore,
  getBannersFromDatabase,
  deleteBannerFromDatabase,
  bulkDeleteBannersFromDatabase,
};
