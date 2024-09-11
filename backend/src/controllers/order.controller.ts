import express from "express";
import {
  addNewOrderToDatabase,
  getNextBatchOfData,
  getOrderDataInBatches,
  getOrdersFromDatabase,
  getPrevBatch,
  updateOrderStatusInDatabase,
} from "../firebase/db/order.firestore.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { redisClient } from "../utils/Redis.js";
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
      status?: "fullfilled" | "cancelled" | "preparing" | "received";
    } = req.body;
    try {
      const user: User = req.user;
      if (!user) throw new ApiError(500, "No user found. Please login first.");

      let { orders, firstDoc, lastDoc, length } = await getOrdersFromDatabase(
        pageSize,
        direction === "next" ? currentLastDoc : null,
        direction === "prev" ? currentFirstDoc : null,
        direction,
        status,
        user.uid
      );
      const pipeline = redisClient.multi();

      orders.forEach((order) => {
        pipeline.lPush(`latest_orders`, JSON.stringify(order));
      });

      pipeline.lRange("latest_orders", 0, 9);
      await pipeline.exec();

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
      throw new ApiError(
        500,
        "Error while fetching user orders.",
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
      const pipeline = redisClient.multi();
      pipeline.lPush("latest_orders", JSON.stringify(order));
      pipeline.lRange("latest_orders", 0, 9);
      await pipeline.exec();
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
    status?: "fullfilled" | "cancelled" | "preparing" | "received";
    userId?: string;
  } = req.body;

  try {
    let { orders, firstDoc, lastDoc, length } = await getOrdersFromDatabase(
      pageSize,
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
    throw new ApiError(
      401,
      "Something went wrong while fetching orders from database",
      null,
      error as string[]
    );
  }
});

const getOrderInBatch = asyncHandler(async (req: any, res: any) => {
  try {
    const { direction, currentLastDoc, currentFirstDoc, limit} = req.body;

    if (direction === "next") {
      const orderData = await getNextBatchOfData(currentLastDoc, limit);
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { orderData },
            "Order data fetched successfully.",
            true
          )
        );
    } else if (direction === "prev") {
      const orderData = await getPrevBatch(currentFirstDoc, limit);
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { orderData },
            "Order data fetched successfully.",
            true
          )
        );
    }
    const orderData = await getOrderDataInBatches(limit);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { orderData },
          "Order data fetched successfully.",
          true
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Something went wrong while fetching user order",
          null,
          error as string[]
        )
      );
  }
});
export {
  getOrderByUserIdFromDatabase,
  addNewOrder,
  updateOrder,
  fetchOrders,
  getOrderInBatch,
};
