import { FieldValue } from "firebase-admin/firestore";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";
import { CartInfo } from "../../models/cart.model.js";

const addCartInFirestore = async (uid: string, productId: string) => {
  try {
    const docRef = db.collection("carts").doc(uid);
    const doc = await docRef.get();
    if (!doc.exists) {
      await docRef.set({
        uid,
        products: [productId],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: null,
      });
    } else {
      const cartData = doc.data() as CartInfo;
      if (!cartData.products.includes(productId)) {
        cartData.products.push(productId);
        cartData.updatedAt = FieldValue.serverTimestamp();

        await docRef.update({
          products: cartData.products,
          updatedAt: cartData.updatedAt,
        });
      }
    }
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while adding products in cart.",
      null,
      error as string[]
    );
  }
};

const removeItemFromCart = async (uid: string, productId: string) => {
  try {
    const docRef = db.collection("carts").doc(uid);
    const doc = await docRef.get();
    if (doc.exists) {
      const docData = doc.data() as CartInfo;
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
      "Something went wrong while removing item from carts.",
      null,
      error as string[]
    );
  }
};

const getCartsFromFirestore = async (uid: string) => {
  try {
    const docRef = db.collection("carts").doc(uid);
    const doc = await docRef.get();
    if (doc.exists) {
      const docData = doc.data() as CartInfo;
      return docData;
    } else {
      const data: CartInfo = {
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
      "Something went wrong while getting user's carts.",
      null,
      error as string[]
    );
  }
};

export { addCartInFirestore, removeItemFromCart, getCartsFromFirestore };