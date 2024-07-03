import {
  addNewOrderToDatabase,
  getAllOrders,
  getOrdersByUserId,
} from "../firebase/db/order.firestore.js";
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
  async (req: any, res: any) => {
    try {
      const { id } = req.body;
      const response = await getOrdersByUserId(id);
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

export { getAllOrdersFromDatabase, getOrderByUserIdFromDatabase, addNewOrder };
