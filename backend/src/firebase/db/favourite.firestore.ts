import { FieldValue } from "firebase-admin/firestore";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";
import { FavouriteInfo } from "../../models/favourite.model.js";

const addProductInFavourite = async (uid: string, productId: string) => {
  try {
    const docRef = db.collection("favourites").doc(uid);
    const doc = await docRef.get();
    if (!doc.exists) {
      await docRef.set({
        uid,
        products: [productId],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: null,
      });
    } else {
      const favouritesData = doc.data() as FavouriteInfo;
      if (!favouritesData.products.includes(productId)) {
        favouritesData.products.push(productId);
        favouritesData.updatedAt = FieldValue.serverTimestamp();

        await docRef.update({
          products: favouritesData.products,
          updatedAt: favouritesData.updatedAt,
        });
      }
    }
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while adding product in firestore.",
      null,
      error as string[]
    );
  }
};

const removeItemFromFavourite = async (uid: string, productId: string) => {
  try {
    const docRef = db.collection("favourites").doc(uid);
    const doc = await docRef.get();
    if (doc.exists) {
      const docData = doc.data() as FavouriteInfo;
      if (docData.products.includes(productId)) {
        docData.products = docData.products.filter((pid) => pid !== productId);
        docData.updatedAt = FieldValue.serverTimestamp();

        await docRef.update({
          products: docData.products,
          updatedAt: docData.updatedAt,
        });
      }
    }
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while removing item from favourites.",
      null,
      error as string[]
    );
  }
};

const getFavouritesFromFirestore = async (uid: string) => {
  try {
    const docRef = db.collection("favourites").doc(uid);
    const doc = await docRef.get();
    if (doc.exists) {
      const docData = doc.data() as FavouriteInfo;
      return docData;
    } else {
      const data: FavouriteInfo = {
        uid,
        products: [],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: null,
      };

      await docRef.set(data);

      return data;
    }
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while getting user's favourite.",
      null,
      error as string[]
    );
  }
};

export {
  addProductInFavourite,
  removeItemFromFavourite,
  getFavouritesFromFirestore,
};
