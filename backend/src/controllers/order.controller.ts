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

      res.status(200).json(
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
          new ApiError(
            500,
            "Something went wrong while fetching user's order from database",
            null,
            error as string[]
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
      await addNewOrderToDatabase(order);
      return res
        .status(200)
        .json(new ApiResponse(200, "", "Orders fetched successfully", true));
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Error while adding orders to database.",
            null,
            error as string[]
          )
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
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Error while updating products.",
            null,
            error as string[]
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
    res.status(200).json(
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
        new ApiError(
          500,
          "Something went wrong while fetching orders from database",
          null,
          error as string[]
        )
      );
  }
});

export { getOrderByUserIdFromDatabase, addNewOrder, updateOrder, fetchOrders };
