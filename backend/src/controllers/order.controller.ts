import {
  addNewOrderToDatabase,
  getAllOrders,
  getOrdersByUserId,
  getOrdersFromDatabase,
  updateOrderStatusInDatabase,
} from "../firebase/db/order.firestore.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import express from "express";

const getAllOrdersFromDatabase = asyncHandler(async (_: any, res: any) => {
  try {
    const response = await getAllOrders();
    console.log(response);
    return res
      .status(200)
      .json(
        new ApiResponse(200, response, "Orders fetched successfully", true)
      );
  } catch (error) {
    throw new ApiError(
      501,
      "Error fetching orders from database.",
      null,
      error as string[]
    );
  }
});
const getOrderByUserIdFromDatabase = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.body;
      const response = await getOrdersByUserId(id);
      return res
        .status(200)
        .json(
          new ApiResponse(200, response, "Orders fetched successfully", true)
        );
    } catch (error) {
      throw new ApiError(
        501,
        "Error fetching orders from database.",
        null,
        error as string[]
      );
    }
  }
);

const addNewOrder = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const order = req.body;
    if (!order) throw new ApiError(400, "Order not found");
    try {
      await addNewOrderToDatabase(order);
      return res
        .status(200)
        .json(new ApiResponse(200, "", "Orders fetched successfully", true));
    } catch (error) {
      throw new ApiError(
        501,
        "Error while adding orders to database.",
        null,
        error as string[]
      );
    }
  }
);

const updateOrder = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id, status } = req.body;
    try {
      const updatedProduct = await updateOrderStatusInDatabase(id, status);
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { updatedProduct },
            "Product updated successfully.",
            true
          )
        );
    } catch (error) {
      throw new ApiError(500, "Error while updating products.");
    }
  }
);
const fetchOrders = asyncHandler(async (req: any, res: any) => {
  let {
    pageSize,
    filter,
    sort,
    direction,
    currentFirstDoc,
    currentLastDoc,
    status,
    userId,
  }: {
    path: "adminsLog" | "chefLogs" | "customerLogs";
    pageSize: number;
    filter: keyof Order;
    sort: "asc" | "desc";
    currentFirstDoc: any | null;
    currentLastDoc: any | null;
    direction?: "prev" | "next";
    status?: "fullfilled" | "cancelled" | "preparing" | "received";
    userId?: string;
  } = req.body;

  try {
    let { orders, firstDoc, lastDoc, length } = await getOrdersFromDatabase(
      pageSize,
      filter,
      sort,
      direction === "next" ? currentLastDoc : null,
      direction === "prev" ? currentFirstDoc : null,
      direction,
      status,
      userId
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { orders, currentFirstDoc: firstDoc, currentLastDoc: lastDoc, length },
          "Successfully fetched orders from database",
          true
        )
      );
  } catch (error) {
    throw new ApiError(
      401,
      "Something went wrong while fetching orders from database",
      null,
      error as string[]
    );
  }
});
export {
  getAllOrdersFromDatabase,
  getOrderByUserIdFromDatabase,
  addNewOrder,
  updateOrder,
  fetchOrders,
};
