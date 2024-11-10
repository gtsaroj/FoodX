import {
  addNewCategoryInDatabase,
  bulkDeleteCategoryFromDatabase,
  deleteCategoryFromDatabase,
  getAllCategoryFromDatabase,
  updateCategoryInDatabase,
} from "../firebase/db/category.firestore.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import express from "express";
import { redisClient } from "../utils/Redis.js";

const addNewCategory = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { name, image } = req.body;
    try {
      await addNewCategoryInDatabase(name, image);
      await redisClient.del("category");
      const updatedCategory = await getAllCategoryFromDatabase();
      await redisClient.set("category", JSON.stringify(updatedCategory), {
        EX: 3600,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { updatedCategory },
            "New category added successfully",
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
            "Error while adding category.",
            false
          )
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
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            error as string[],
            "Error while fetching category.",
            false
          )
        );
    }
  }
);

const updateCategory = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id, field, newData } = req.body;
    try {
      const updatedData = await updateCategoryInDatabase(id, field, newData);
      await redisClient.del("category");
      const updatedCategoryData = await getAllCategoryFromDatabase();
      await redisClient.set("category", JSON.stringify(updatedCategoryData), {
        EX: 3600,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { updatedData, updatedCategoryData },
            "Category fetched successfully",
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
            "Error while updating category.",
            false
          )
        );
    }
  }
);

const deleteCategory = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id } = req.body;
    try {
      const deletedCategory = await deleteCategoryFromDatabase(id);
      await redisClient.del("category");
      const updatedCategoryData = await getAllCategoryFromDatabase();
      await redisClient.set("category", JSON.stringify(updatedCategoryData), {
        EX: 3600,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { deletedCategory, updatedCategoryData },
            "Category deleted successfully",
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
            "Error while deleting category.",
            false
          )
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
    await redisClient.del("category");
    const updatedCategoryData = await getAllCategoryFromDatabase();
    await redisClient.set("category", JSON.stringify(updatedCategoryData), {
      EX: 3600,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedCategoryData },
          "Categories deleted successfully.",
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
          "Error while deleting categories.",
          false
        )
      );
  }
});

export {
  addNewCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
  deleteCategoriesInBulk,
};
