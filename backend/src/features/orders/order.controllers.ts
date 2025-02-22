import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { getOrdersFromDatabase } from "../../actions/order/get/getOrders.js";
import { addNewOrderToDatabase } from "../../actions/order/add/addNewOrder.js";
import { updateOrderStatusInDatabase } from "../../actions/order/update/updateOrder.js";
import { io } from "../../index.js";
import { userSocketMap } from "../../utils/socket/index.js";
import { AddOrderSchemaType } from "../../utils/validate/order/add/addOrderSchema.js";
import { UpdateOrderSchemaType } from "../../utils/validate/order/update/updateOrderSchema.js";

const getOrderByUserIdFromDatabase = asyncHandler(
  async (req: any, res: any) => {
    let {
      pageSize,
      direction,
      currentFirstDoc,
      currentLastDoc,
      status,
    }: {
      pageSize: number;
      currentFirstDoc: any | null;
      currentLastDoc: any | null;
      direction?: "prev" | "next";
      status?: "pending" | "preparing" | "prepared" | "completed" | "cancelled";
    } = req.body;

    let response: API.ApiResponse;
    const user: User.UserData = req.user;
    if (!user) throw new Error("No user found. Please login first.");

    const limitPage = +pageSize;
    let { orders, firstDoc, lastDoc, length } = await getOrdersFromDatabase(
      limitPage,
      direction === "next" ? currentLastDoc : null,
      direction === "prev" ? currentFirstDoc : null,
      direction,
      status,
      user.uid
    );

    response = {
      status: 200,
      data: {
        orders,
        currentFirstDoc: firstDoc,
        currentLastDoc: lastDoc,
        length,
      },
      message: "Successfully fetched user's order from database",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const addNewOrder = asyncHandler(
  async (req: Request<{}, {}, AddOrderSchemaType>, res: Response) => {
    const order = req.body;
    if (!order) throw new Error("Order not found");
    let response: API.ApiResponse;

    const orderId = await addNewOrderToDatabase({
      ...order,
      orderId: "",
      note: order.note || "",
      orderFullFilled: null,
    });
    io.to("chef").emit("new_order", { ...order, orderId });

    response = {
      status: 201,
      data: orderId,
      message: "Order added successfully",
      success: true,
    };
    return res.status(201).json(response);
  }
);

const updateOrder = asyncHandler(
  async (req: Request<{}, {}, UpdateOrderSchemaType>, res: Response) => {
    const { id, status, price, userId } = req.body;
    const socketId = userSocketMap[userId];

    let response: API.ApiResponse;
    const totalPrice = +price;
    const updatedOrder = await updateOrderStatusInDatabase(
      id,
      status,
      totalPrice
    );
    io.to(socketId).emit("order_status", { ...updatedOrder, id, status });
    response = {
      status: 200,
      data: updatedOrder,
      message: "Order updated successfully",
      success: true,
    };
    return res.status(200).json(response);
  }
);
const fetchOrders = asyncHandler(async (req: any, res: any) => {
  let {
    pageSize,
    direction,
    currentFirstDoc,
    currentLastDoc,
    status,
    userId,
  }: {
    pageSize: number;
    currentFirstDoc: any | null;
    currentLastDoc: any | null;
    direction?: "prev" | "next";
    status?: "pending" | "preparing" | "prepared" | "completed" | "cancelled";
    userId?: string;
  } = req.body;

  let response: API.ApiResponse;
  const limitPage = +pageSize;
  let { orders, firstDoc, lastDoc, length } = await getOrdersFromDatabase(
    limitPage,
    direction === "next" ? currentLastDoc : null,
    direction === "prev" ? currentFirstDoc : null,
    direction,
    status,
    userId
  );
  response = {
    status: 200,
    data: {
      orders,
      currentFirstDoc: firstDoc,
      currentLastDoc: lastDoc,
      length,
    },
    message: "Successfully fetched orders from database.",
    success: true,
  };
  return res.status(200).json(response);
});

const searchOrderBasedOnUid = asyncHandler(async (req: any, res: any) => {
  let {
    pageSize,
    direction,
    currentFirstDoc,
    currentLastDoc,
    status,
  }: {
    pageSize: number;
    currentFirstDoc: any | null;
    currentLastDoc: any | null;
    direction?: "prev" | "next";
    status?: "pending" | "preparing" | "prepared" | "completed" | "cancelled";
  } = req.body;

  const { uid }: { uid: string } = req.body;
  if (!uid) throw new Error("No user found. Please login first.");
  let response: API.ApiResponse;

  const limitPage = +pageSize;
  let { orders, firstDoc, lastDoc, length } = await getOrdersFromDatabase(
    limitPage,
    direction === "next" ? currentLastDoc : null,
    direction === "prev" ? currentFirstDoc : null,
    direction,
    status,
    uid
  );

  response = {
    status: 200,
    data: {
      orders,
      currentFirstDoc: firstDoc,
      currentLastDoc: lastDoc,
      length,
    },
    message: "Successfully fetched orders from database based on uid.",
    success: true,
  };

  return res.status(200).json(response);
});
export {
  getOrderByUserIdFromDatabase,
  addNewOrder,
  updateOrder,
  fetchOrders,
  searchOrderBasedOnUid,
};
