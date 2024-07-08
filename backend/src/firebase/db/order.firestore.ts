import { nanoid } from "nanoid";
import { Order } from "../../models/order.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";

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

export { addNewOrderToDatabase, getAllOrders, getOrders, getOrdersByUserId };
