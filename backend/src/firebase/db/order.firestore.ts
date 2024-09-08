import { FieldValue } from "firebase-admin/firestore";
import { Order, OrderInfo, OrderStatus } from "../../models/order.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";
import { paginateFnc } from "../utils.js";
import {
  findUserInDatabase,
  updateTotalOrder,
} from "./user.firestore.js";
import {
  findProductInDatabase,
  updateTotalSold,
} from "./product.firestore.js";

const addNewOrderToDatabase = async (order: Order) => {
  const orderDocRef = db.collection("orders");
  if (!orderDocRef) throw new ApiError(404, "Couldn't find order collection.");
  try {
    const { orderRequest, products, uid, status, note } = order;
    await orderDocRef
      .add({
        orderId: "",
        orderRequest,
        products,
        status,
        uid,
        note,
      })
      .then((docRef) => {
        docRef.update({
          orderId: docRef.id,
          createdAt: FieldValue.serverTimestamp(),
        });
      });
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to add order in database.",
      null,
      error as string[]
    );
  }
};

const getOrder = async (id: string) => {
  try {
    const orderRef = db.collection("orders");
    const doc = await orderRef.doc(id).get();
    if (!doc.exists) throw new ApiError(404, "Couldn't find your order");
    const docData = doc.data() as OrderInfo;
    return docData;
  } catch (error) {
    throw new ApiError(500, "Error searching order.", null, error as string[]);
  }
};

const updateOrderStatusInDatabase = async (id: string, status: OrderStatus) => {
  const orderRef = db.collection("orders").doc(id);
  if (!orderRef) throw new ApiError(404, "No document found.");
  try {
    const batch = db.batch();
    let doc;
    if (status !== "fullfilled") {
      doc = await orderRef.update({
        status,
      });
      return doc;
    }
    doc = await orderRef.update({
      status,
      orderFullfilled: new Date().getTime(),
    });
    const orderData = await getOrder(id);
    const { uid, products } = orderData;
    const { role } = await findUserInDatabase(uid);
    await updateTotalOrder(role, uid);
    products.forEach(async (product) => {
      const { collection } = await findProductInDatabase(product.id);
      await updateTotalSold(collection, product.id);
    });

    await batch.commit();

    return doc;
  } catch (error) {
    throw new ApiError(440, "Error updating orders in database.");
  }
};

const getOrdersFromDatabase = async (
  pageSize: number,
  filter: keyof Order,
  sort: "asc" | "desc" = "asc",
  startAfterDoc: any | null = null,
  startAtDoc: any | null = null,
  direction?: "prev" | "next",
  status?: string,
  userId?: string
) => {
  try {
    const { query, totalLength } = await paginateFnc(
      "orders",
      filter,
      startAfterDoc,
      startAtDoc,
      pageSize,
      sort,
      direction
    );
    let orderDoc;
    if (status && !userId) {
      orderDoc = await query.where("status", "==", status).get();
    } else if (!status && userId) {
      orderDoc = await query.where("userId", "==", userId).get();
    } else if (userId && status) {
      orderDoc = await query
        .where("userId", "==", userId)
        .where("status", "==", status)
        .get();
    } else {
      orderDoc = await query.get();
    }
    const orders: Order[] = [];

    orderDoc.docs.forEach((doc) => {
      orders.push(doc.data() as Order);
    });

    const firstDoc = orderDoc.docs[0]?.data().orderId || null;
    const lastDoc =
      orderDoc.docs[orderDoc.docs.length - 1]?.data().orderId || null;
    return {
      orders,
      firstDoc,
      lastDoc,
      length: totalLength,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Error fetching orders from database.",
      null,
      error as string[]
    );
  }
};
export {
  addNewOrderToDatabase,
  updateOrderStatusInDatabase,
  getOrdersFromDatabase,
};
