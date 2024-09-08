import { FieldValue } from "firebase-admin/firestore";
import { Revenue, RevenueInfo } from "../../models/revenue.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";

const addRevenueDataToFirestore = async (ordersArray: Revenue[]) => {
  const revenueRef = db.collection("revenue");
  try {
    if (!revenueRef) throw new ApiError(404, "Revenue collection not found.");

    //add all the orders to revenue collection with date set as doc id
    for (const order of ordersArray) {
      const docRef = await revenueRef.doc(order.id).get();
      if (docRef.exists) {
        await revenueRef.doc(order.id).update({
          orders: FieldValue.arrayUnion(...order.orders),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        await revenueRef.doc(order.id).set({
          id: order.id,
          orders: order.orders,
          createdAt: FieldValue.serverTimestamp(),
        });
      }
    }
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while adding revenue to database.",
      null,
      error as string[],
      undefined,
      false
    );
  }
};

const getRevenueDataFromFirestore = async (
  startDate: string,
  endDate?: string
) => {
  try {
    const query = db.collection("revenue");
    let querySnapShot;
    if (startDate && endDate) {
      querySnapShot = await query
        .where("id", ">=", new Date(startDate).toDateString())
        .where("id", "<=", new Date(endDate).toDateString())
        .get();
    } else {
      querySnapShot = await query
        .where("id", "==", new Date(startDate).toDateString())
        .get();
    }
    const revenue: RevenueInfo[] = [];

    querySnapShot?.docs.forEach((doc) => {
      revenue.push(doc.data() as RevenueInfo);
    });
    return revenue;
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while fetching revenue from database.",
      null,
      error as string[],
      undefined,
      false
    );
  }
};

export { addRevenueDataToFirestore, getRevenueDataFromFirestore };
