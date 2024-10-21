import { FieldValue } from "firebase-admin/firestore";
import { Order, OrderInfo, OrderStatus } from "../../models/order.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";
import { paginateFnc } from "../utils.js";
import {
  findUserInDatabase,
  updateTotalOrder,
  updateTotalSpent,
} from "./user.firestore.js";
import {
  findProductInDatabase,
  updateProductStockInFirestore,
  updateTotalSold,
} from "./product.firestore.js";

const addNewOrderToDatabase = async (order: Order) => {
  const orderDocRef = db.collection("orders");
  if (!orderDocRef) throw new ApiError(404, "Couldn't find order collection.");
  try {
    const { orderRequest, products, uid, status, note } = order;
    const orderData = await orderDocRef
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
        return docRef.id;
      });
    return orderData;
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

const updateOrderStatusInDatabase = async (
  id: string,
  status: OrderStatus,
  price: number
) => {
  const orderRef = db.collection("orders").doc(id);
  if (!orderRef) throw new ApiError(404, "No document found.");
  try {
    const batch = db.batch();
    let doc;
    if (status !== "completed") {
      doc = await orderRef.update({
        status,
      });
      const getDocData = (await orderRef.get()).data();
      return getDocData;
    }
    doc = await orderRef.update({
      status,
      orderFullfilled: new Date().getTime(),
    });
    const orderData = await getOrder(id);
    const { uid, products } = orderData;
    const { role } = await findUserInDatabase(uid);
    if (price <= 0) {
      throw new ApiError(500, "Total price of order can't be 0 or less.");
    }
    await updateTotalSpent(role, uid, price);
    await updateTotalOrder(role, uid);
    products.forEach(async (product) => {
      const { collection, foundProduct } = await findProductInDatabase(
        product.id
      );
      if (
        foundProduct.quantity < product.quantity ||
        foundProduct.quantity === 0
      ) {
        throw new ApiError(401, "Not enough stock");
      }
      await updateProductStockInFirestore(
        collection,
        product.id,
        product.quantity
      );
      await updateTotalSold(collection, product.id, product.quantity);
    });

    await batch.commit();
    const order = (await orderRef.get()).data();

    return order;
  } catch (error) {
    throw new ApiError(440, "Error updating orders in database.");
  }
};

const getOrdersFromDatabase = async (
  pageSize: number,
  startAfterDoc: any | null = null,
  startAtDoc: any | null = null,
  direction?: "prev" | "next",
  status?: "pending" | "preparing" | "prepared" | "completed" | "cancelled",
  userId?: string
) => {
  try {
    const { query, totalLength } = await paginateFnc(
      "orders",
      "createdAt",
      startAfterDoc,
      startAtDoc,
      pageSize,
      "desc",
      direction,
      userId,
      status
    );
    const orderDoc = await query.get();
    const orders: Order[] = [];

    orderDoc.docs.forEach((doc) => {
      orders.push(doc.data() as Order);
    });

    const firstDoc = orderDoc.docs[0].data().orderId || null;
    const lastDoc =
      orderDoc.docs[orderDoc.docs.length - 1].data().orderId || null;

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
