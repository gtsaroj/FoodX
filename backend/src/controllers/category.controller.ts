import {
  addNewCategoryInDatabase,
  getAllCategoryFromDatabase,
  updateCategoryInDatabase,
} from "../firebase/db/category.firestore.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import express from "express";

const addNewCategory = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { name, image } = req.body;
    try {
      await addNewCategoryInDatabase(name, image);
      return res
        .status(200)
        .json(
          new ApiResponse(200, "", "New category added successfully", true)
        );
    } catch (error) {
      throw new ApiError(
        501,
        "Error while adding category.",
        null,
        error as string[]
      );
    }
  }
);

const getAllCategory = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    try {
      const categories = await getAllCategoryFromDatabase();
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            categories,
            "Category fetched successfully",
            true
          )
        );
    } catch (error) {
      throw new ApiError(
        501,
        "Error while fetching category.",
        null,
        error as string[]
      );
    }
  }
);

const updateCategory = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id, field, newData } = req.body;
    try {
      const updatedData = await updateCategoryInDatabase(id, field, newData);
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { updatedData },
            "Category fetched successfully",
            true
          )
        );
    } catch (error) {
      throw new ApiError(
        501,
        "Error while updating category.",
        null,
        error as string[]
      );
    }
  }
);

export { addNewCategory, getAllCategory, updateCategory };
