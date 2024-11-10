import {
  addRevenueDataToFirestore,
  getRevenueDataFromFirestore,
} from "../firebase/db/revenue.firestore.js";
import { Revenue } from "../models/revenue.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const addRevenueData = asyncHandler(async (req: any, res: any) => {
  try {
    const order: Revenue = req.body;
    const revenueData = await addRevenueDataToFirestore(order);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { revenueData },
          "Revenue Added Successfully.",
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
          "Something went wrong while adding revenue to database",
          false
        )
      );
  }
});
const fetchRevenue = asyncHandler(async (req: any, res: any) => {
  let {
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  } = req.body;

  try {
    const revenue = await getRevenueDataFromFirestore(startDate, endDate);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          revenue,
          "Successfully fetched revenue from database",
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
          "Something went wrong while fetching revenue from database",
          false
        )
      );
  }
});

export { fetchRevenue, addRevenueData };
