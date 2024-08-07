import { nanoid } from "nanoid";
import { Order, OrderStatus } from "../../models/order.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";
import { Product } from "../../models/product.model.js";
import { paginateFnc } from "../utils.js";

const addNewOrderToDatabase = async (order: Order) => {
  const orderDocRef = db.collection("orders");
  if (!orderDocRef) throw new ApiError(404, "Couldn't find order collection.");
  try {
    const { orderFullFilled, orderRequest, products, uid, status } = order;
    await orderDocRef
      .add({
        orderFullFilled,
        orderId: "",
        orderRequest,
        products,
        status,
        uid,
      })
      .then((docRef) => {
        docRef.update({
          orderId: docRef.id,
        });
      });
  } catch (err) {
    throw new ApiError(400, "Unable to add order in database.");
  }
};
const getOrdersByUserId = async (uid: string) => {
  console.log(uid);
  const orderDocRef = db.collection("orders");
  try {
    let orders: Order[] = [];
    const query = await orderDocRef.where("uid", "==", uid).get();
    if (query.empty) return orders;
    query.docs.forEach((doc) => {
      const data = doc.data() as Order;
      orders.push(data);
    });

    console.log(orders);
    return orders;
  } catch (error) {
    throw new ApiError(400, "No orders found.");
  }
};
const getOrders = async () => {};

const getAllOrders = async () => {
  const orderRef = db.collection("orders");
  try {
    const orders: Order[] = [];
    const docs = await orderRef.get();
    if (!docs) throw new ApiError(404, "No document found.");
    docs.forEach((doc) => {
      orders.push(doc.data() as Order);
    });

    return orders as Order[];
  } catch (error) {
    throw new ApiError(440, "No orders found.");
  }
};
const updateOrderStatusInDatabase = async (id: string, status: OrderStatus) => {
  const orderRef = db.collection("orders");
  if (!orderRef) throw new ApiError(404, "No document found.");
  try {
    let doc;
    if (status !== "fullfilled") {
      doc = await orderRef.doc(id).update({
        status,
      });
    } else {
      doc = await orderRef.doc(id).update({
        status,
        orderFullfilled: new Date().getTime(),
      });
      return doc;
    }
  } catch (error) {
    throw new ApiError(440, "Error updating orders in database.");
  }
};

// const updateOrderItemInDatabase = async (
//   id: string,
//   action: "add" | "delete",
//   productId: string,
//   prevData: Product[]
// ) => {
//   const orderRef = db.collection("orders");
//   if (!orderRef) throw new ApiError(404, "No document found.");
//   try {
//     // const doc = orderRef.doc(id).update({
//     //   [`products`]:
//     // })
//   } catch (error) {
//     throw new ApiError(440, "Error updating orders in database.");
//   }
// };

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
    const {query, totalLength} =await paginateFnc(
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
      length: totalLength
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
  getAllOrders,
  getOrders,
  getOrdersByUserId,
  updateOrderStatusInDatabase,
  getOrdersFromDatabase,
};
