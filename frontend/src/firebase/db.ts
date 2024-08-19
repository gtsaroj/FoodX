import { doc, getDoc } from "firebase/firestore";
import { db } from ".";
import { Category } from "../models/product.model";
import { DbUser } from "../models/user.model";

export const getCategory = async (docName: "bnw" | "color") => {
  try {
    const categoryRef = doc(db, "category", docName);

    const docSnap = await getDoc(categoryRef);
    if (!docSnap.exists) throw new Error("Document is empty.");
    const data = docSnap.data();
    return data as Category;
  } catch (error) {
    throw new Error("Error while getting category from database.");
  }
};

export const getUserData = async (
  docName: "customers" | "admins",
  uid: string
) => {
  try {
    const userRef = doc(db, docName, uid);

    const snapShot = await getDoc(userRef);
    if (!snapShot.exists) throw new Error("User document is empty.");
    const data = snapShot.data();
    return data as DbUser;
  } catch (error) {
    throw new Error("Error while getting user from database.");
  }
};
