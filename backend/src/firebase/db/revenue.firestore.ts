import { FieldValue } from "firebase-admin/firestore";
import { OrderProp, Revenue } from "../../models/revenue.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";

const addRevenueDataToFirestore = async (ordersArray: Revenue[]) => {
  // const orderRef = db.collection("orders");
  // if (!orderRef) throw new ApiError(501, "Order collection not found.");
  
  const revenueRef = db.collection("revenue");
  try {
    if (!revenueRef) throw new ApiError(501, "Revenue collection not found.");

    /*
    this will only read products and orderRequest field in orders collection
    const orderDoc = await orderRef.select("products", "orderRequest").get();

    store all the orders returned from orders collections
    const ordersArray: Revenue[] = [];
    orderDoc.forEach((doc) => {
      const docData = doc.data() as OrderProp;
      const data: Revenue = {
        orders: docData.products,
        id: new Date(docData.orderRequest).toDateString(),
      };
      ordersArray.push(data);
    });
    */

    //add all the orders to revenue collection with date set as doc id
    for (const order of ordersArray) {
      const docRef = await revenueRef.doc(order.id).get();
      if (docRef.exists) {
        await revenueRef.doc(order.id).update({
          orders: FieldValue.arrayUnion(...order.orders),
        });
      } else {
        await revenueRef.doc(order.id).set({
          id: order.id,
          orders: order.orders,
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
    const revenue: Revenue[] = [];

    querySnapShot?.docs.forEach((doc) => {
      revenue.push(doc.data() as Revenue);
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
