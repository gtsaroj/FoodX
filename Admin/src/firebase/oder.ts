// add new order to database

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  endBefore,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { Order } from "../models/order.model";
import { db } from ".";

const addOrderToDatabase = async (order: Order) => {
  const orderRef = collection(db, "orders");
  try {
    await addDoc(orderRef, order);
  } catch (error) {
    throw new Error("Unable to add the ordere in database.");
  }
};

const deleteOrderFromDatabase = async (id: string) => {
  const orderRef = doc(db, "orders", id);
  try {
    await deleteDoc(orderRef);
  } catch (error) {
    throw new Error("Error deleting the order from database!");
  }
};

const getOrderByUser = async (
  uid: string,
  lastVisibleOrder?: any,
  next?: boolean
) => {
  const orderRef = collection(db, "orders");
  try {
    let docs;
    console.log("Reached here......");
    console.log(lastVisibleOrder);
    if (next && lastVisibleOrder) {
      docs = query(
        orderRef,
        where("uid", "==", uid),
        orderBy("orderRequest", "desc"),
        startAfter(lastVisibleOrder),
        limit(5)
      );
    } else if (!next && lastVisibleOrder) {
      docs = query(
        orderRef,
        where("uid", "==", uid),
        orderBy("orderRequest", "desc"),
        endBefore(lastVisibleOrder),
        limit(5)
      );
    } else if (!next && !lastVisibleOrder) {
      docs = query(
        orderRef,
        where("uid", "==", uid),
        orderBy("orderRequest", "desc"),
        limit(5)
      );
    }

    if (!docs) throw new Error("No document found.");

    const orderArray: Order[] = [];
    const order = await getDocs(docs);

    order.forEach((item) => {
      const data = item.data() as Order;
      orderArray.push(data);
    });

    return orderArray;
  } catch (error) {
    console.error(error);
    throw new Error("Error getting user orders!");
  }
};

// const getOrderByUser = async (
//   uid: string,
//   lastVisibleOrder?: any,
//   nextPage?: boolean
// ) => {
//   const orderRef = collection(db, "orders");
//   try {
//     let queryRef = query(
//       orderRef,
//       where("uid", "==", uid),
//       orderBy("orderRequest"),
//       limit(10)
//     );
//     if (nextPage && lastVisibleOrder) {
//       queryRef = queryRef.startAfter(lastVisibleOrder);
//     } else if (!nextPage && lastVisibleOrder) {
//       queryRef = queryRef.endBefore(lastVisibleOrder);
//     }

//     const orderSnapshot = await getDocs(queryRef);
//     const orderArray: Order[] = [];

//     orderSnapshot.forEach((doc) => {
//       const data = doc.data() as Order;
//       orderArray.push(data);
//     });

//     return orderArray;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Error getting user orders!");
//   }
// };
const getOrderByDate = async () => {};
const getOrder = async () => {};
const getAllOrders = async () => {};

export { addOrderToDatabase, deleteOrderFromDatabase, getOrderByUser };

// const unsub = onSnapshot(docs, (snapshot) => {
//   snapshot.docChanges().forEach((change) => {
//     if (change.type === "added") {
//       console.log("New order added", change.doc.data());
//       return change.doc.data() as Order[];
//     }
//     if (change.type === "removed") {
//       console.log("Order removed. ", change.doc.data());
//       return change.doc.data() as Order[];
//     }
//   });
// }
