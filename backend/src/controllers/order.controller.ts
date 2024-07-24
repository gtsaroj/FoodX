import {
  addNewOrderToDatabase,
  getAllOrders,
  getOrdersByUserId,
  updateOrderStatusInDatabase,
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

export {
  getAllOrdersFromDatabase,
  getOrderByUserIdFromDatabase,
  addNewOrder,
  updateOrder,
};
