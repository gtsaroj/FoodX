import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from ".";
import { Category } from "../models/productMode";
import { DbUser } from "../models/UserModels";
import { Order } from "../models/order.model";

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

export const getCustomerData = async (
  docName: "customers"
): Promise<DbUser[]> => {
  try {
    const customerRef = collection(db, docName);
    const customerSnapchat = await getDocs(customerRef);

    const customerList = customerSnapchat.docs.map((data) => data.data());
    return customerList as DbUser[];
  } catch (error) {
    throw new Error("Error while getting customers from database.");
  }
};

// export const getOrderByUserId = async (docName: "orders", uid: string) => {
//   try {
//     const orderRef

//     const querySnapshot = orderRef.
//     const snapShot = await getDoc(userRef);
//     if (!snapShot.exists) throw new Error("User document is empty.");
//     console.log(snapShot.data());
//     const data = snapShot.data();
//     return data as Order[];
//   } catch (error) {
//     throw new Error("Error while getting user from database.");
//   }
// };
