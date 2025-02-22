import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { addRevenueDataToFirestore } from "../../actions/revenue/add/addRevenueData.js";
import { getRevenueDataFromFirestore } from "../../actions/revenue/get/getRevenueData.js";
import { AddRevenueSchemaType } from "../../utils/validate/revenue/add/addRevenueSchema.js";

const addRevenueData = asyncHandler(
  async (req: Request<{}, {}, AddRevenueSchemaType>, res: Response) => {
    const revenue = req.body;
    const revenueData = await addRevenueDataToFirestore(revenue);

    const response: API.ApiResponse = {
      status: 201,
      data: revenueData,
      message: "Revenue Added Successfully.",
      success: true,
    };
    return res.status(201).json(response);
  }
);

const fetchRevenue = asyncHandler(async (req: any, res: any) => {
  let {
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  } = req.body;

  let response: API.ApiResponse;
  const revenue = await getRevenueDataFromFirestore(startDate, endDate);

  response = {
    status: 200,
    data: revenue,
    message: "Successfully fetched revenue from database",
    success: true,
  };
  return res.status(200).json(response);
});

export { fetchRevenue, addRevenueData };
