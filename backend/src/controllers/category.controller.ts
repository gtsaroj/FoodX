import {
  addNewCategoryInDatabase,
  bulkDeleteCategoryFromDatabase,
  deleteCategoryFromDatabase,
  getAllCategoryFromDatabase,
  updateCategoryInDatabase,
} from "../firebase/db/category.firestore.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import express from "express";
import { redisClient } from "../utils/Redis.js";

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
      await redisClient.set("category", JSON.stringify(categories), {
        EX: 3600,
      });
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

const deleteCategory = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id } = req.body;
    try {
      const deletedCategory = await deleteCategoryFromDatabase(id);
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { deletedCategory },
            "Category deleted successfully",
            true
          )
        );
    } catch (error) {
      throw new ApiError(
        501,
        "Error while deleting category.",
        null,
        error as string[]
      );
    }
  }
);
const deleteCategoriesInBulk = asyncHandler(async (req: any, res: any) => {
  const {
    ids,
  }: {
    ids: string[];
  } = req.body;
  try {
    await bulkDeleteCategoryFromDatabase(ids);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Categories deleted successfully.", true));
  } catch (error) {
    throw new ApiError(500, "Error while deleting categories.");
  }
});

export {
  addNewCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
  deleteCategoriesInBulk,
};
