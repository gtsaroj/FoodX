import express from "express";
import {
  addNewOrderToDatabase,
  getOrdersFromDatabase,
  updateOrderStatusInDatabase,
} from "../firebase/db/order.firestore.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { io } from "../app.js";
import { userSocketMap } from "../index.js";

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
    try {
      const user: User = req.user;
      if (!user) throw new ApiError(500, "No user found. Please login first.");

      const limitPage = +pageSize;
      let { orders, firstDoc, lastDoc, length } = await getOrdersFromDatabase(
        limitPage,
        direction === "next" ? currentLastDoc : null,
        direction === "prev" ? currentFirstDoc : null,
        direction,
        status,
        user.uid
      );

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            orders,
            currentFirstDoc: firstDoc,
            currentLastDoc: lastDoc,
            length,
          },
          "Successfully fetched orders from database",
          true
        )
      );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            error as string[],
            "Something went wrong while fetching user's order from database",
            false
          )
        );
    }
  }
);
const addNewOrder = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const order = req.body;
    if (!order) throw new ApiError(400, "Order not found");
    try {
      const orderId = await addNewOrderToDatabase(order);
      io.to("chef").emit("new_order", { ...order, orderId });
      return res
        .status(200)
        .json(
          new ApiResponse(200, orderId, "Orders fetched successfully", true)
        );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            error as string[],
            "Error while adding orders to database.",
            false
          )
        );
    }
  }
);

const updateOrder = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id, status, price, userId } = req.body;
    const socketId = userSocketMap[userId];
    try {
      const totalPrice = +price;
      const updatedOrder = await updateOrderStatusInDatabase(
        id,
        status,
        totalPrice
      );
      io.to(socketId).emit("order_status", { ...updatedOrder, id, status });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { updatedOrder },
            "Order updated successfully.",
            true
          )
        );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            error as string[],
            "Error while updating order.",
            false
          )
        );
    }
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

  try {
    const limitPage = +pageSize;
    let { orders, firstDoc, lastDoc, length } = await getOrdersFromDatabase(
      limitPage,
      direction === "next" ? currentLastDoc : null,
      direction === "prev" ? currentFirstDoc : null,
      direction,
      status,
      userId
    );
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          orders,
          currentFirstDoc: firstDoc,
          currentLastDoc: lastDoc,
          length,
        },
        "Successfully fetched orders from database",
        true
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error as string[],
          "Something went wrong while fetching orders from database",
          false
        )
      );
  }
});

const getOrderBasedOnUid = asyncHandler(async (req: any, res: any) => {
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
  try {
    const { uid }: { uid: string } = req.body;
    if (!uid) throw new ApiError(500, "No user found. Please login first.");

    const limitPage = +pageSize;
    let { orders, firstDoc, lastDoc, length } = await getOrdersFromDatabase(
      limitPage,
      direction === "next" ? currentLastDoc : null,
      direction === "prev" ? currentFirstDoc : null,
      direction,
      status,
      uid
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          orders,
          currentFirstDoc: firstDoc,
          currentLastDoc: lastDoc,
          length,
        },
        "Successfully fetched orders from database based on uid.",
        true
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error as string[],
          "Something went wrong while fetching user's order from database on id.",
          false
        )
      );
  }
});
export {
  getOrderByUserIdFromDatabase,
  addNewOrder,
  updateOrder,
  fetchOrders,
  getOrderBasedOnUid,
};
