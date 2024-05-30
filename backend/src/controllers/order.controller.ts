import {
  getAllOrders,
  getOrdersByUserId,
} from "../firebase/db/order.firestore.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

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

export { getAllOrdersFromDatabase, getOrderByUserIdFromDatabase };
