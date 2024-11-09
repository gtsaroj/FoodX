import { FieldValue } from "firebase-admin/firestore";
import { BannerInfo } from "../../models/banner.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";

const addBannerToFirestore = async (
  title: string,
  image: string,
  collection: string,
  link: string
) => {
  const bannerRef = db.collection(collection);
  if (!bannerRef) throw new ApiError(404, "No banner collection found.");
  try {
    const banner = await bannerRef
      .add({
        id: "",
        title,
        image,
        date: new Date(),
        link: link ? link : "",
      })
      .then((docRef) =>
        docRef.update({
          id: docRef.id,
          createdAt: FieldValue.serverTimestamp(),
        })
      );
    return { banner, collection };
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to add banner in database.",
      null,
      error as string[]
    );
  }
};
const getBannersFromDatabase = async (collection: string) => {
  const bannerRef = db.collection(collection);
  if (!bannerRef) throw new ApiError(404, "No banner collection found.");

  try {
    const bannerDocs = await bannerRef.get();
    let banners: BannerInfo[] = [];
    if (bannerDocs.empty) throw new ApiError(404, "No banners found.");
    bannerDocs.forEach((doc) => {
      const data = doc.data() as BannerInfo;
      banners.push(data);
    });
    return { banners, collection };
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to get banners from database.",
      null,
      error as string[]
    );
  }
};

const deleteBannerFromDatabase = async (id: string, collection: string) => {
  const bannerRef = db.collection(collection);
  if (!bannerRef) throw new ApiError(404, "No banner collection found.");
  try {
    await bannerRef.doc(id).delete();
    return collection;
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to get banners from database.",
      null,
      error as string[]
    );
  }
};

const bulkDeleteBannersFromDatabase = async (
  id: string[],
  collection: string
) => {
  const bannerRef = db.collection("banners");
  if (!bannerRef) throw new ApiError(404, "No banners collection available.");
  try {
    const batch = db.batch();

    id.forEach((bannerId) => {
      const docRef = bannerRef.doc(bannerId);
      batch.delete(docRef);
    });
    await batch.commit();
    return collection;
  } catch (error) {
    throw new ApiError(
      401,
      "Unable to bulk delete banners from database.",
      null,
      error as string[]
    );
  }
};

export {
  addBannerToFirestore,
  getBannersFromDatabase,
  deleteBannerFromDatabase,
  bulkDeleteBannersFromDatabase,
};
