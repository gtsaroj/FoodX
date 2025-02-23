import { db } from "../../../firebase/index.js";

export const getOrder = async (id: string) => {
  try {
    const orderRef = db.collection("orders");
    const doc = await orderRef.doc(id).get();
    if (!doc.exists) throw new Error("Couldn't find your order");
    const docData = doc.data() as Order.OrderInfo;
    return docData;
  } catch (error) {
    throw new Error("Error searching order. " + error);
  }
};
