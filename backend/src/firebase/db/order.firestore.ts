import { nanoid } from "nanoid";
import { Order } from "../../models/order.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";

const addNewOrderToDatabase = async (order: Order) => {
  const orderDocRef = db.collection("orders");
  if (!orderDocRef) throw new ApiError(404, "Couldn't find order collection.");
  try {
    const { orderFullFilled, orderRequest, products, uid, status } = order;

    await orderDocRef.add({
      orderFullFilled,
      orderId: nanoid(),
      orderRequest,
      products,
      status,
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
        const data = doc.data() as Order;
        orders.push(data);
      });
    });
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
