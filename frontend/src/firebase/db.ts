import { doc, getDoc } from "firebase/firestore";
import { db } from ".";
import { Category } from "../models/productMode";

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
