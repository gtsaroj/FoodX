import { nanoid } from "nanoid";
import { Order } from "../../models/order.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";

const addNewOrderToDatabase = async (order: Order) => {
  const orderDocRef = db.collection("orders");
  if (!orderDocRef) throw new ApiError(404, "Couldn't find order collection.");
  try {
    const { orderFullFilled, orderRequest, products, uid } = order;

    await orderDocRef.add({
      orderFullFilled,
      orderId: nanoid(),
      orderRequest,
      products,
      uid,
    });
  } catch (err) {
    throw new ApiError(400, "Unable to add order in database.");
  }
};
const getOrdersByUserId = async (uid: string) => {
  const orderDocRef = db.collection("orders");
  try {
    const orders: Order[] = [];
    const query = orderDocRef.where("uid", "==", uid);
    const observer = query.onSnapshot((querySnapshot) => {
      return querySnapshot.docs.map((doc) => {
        console.log(doc.data());
      });
    });
    console.log(observer);
  } catch (error) {
    throw new ApiError(400, "No orders found.");
  }
};
const getOrders = async () => {};
const getAllOrders = async () => {};

export { addNewOrderToDatabase, getAllOrders, getOrders, getOrdersByUserId };
