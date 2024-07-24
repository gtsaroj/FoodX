import express from "express";
import {
  addProductToFirestore,
  getAllProductsFromDatabase,
  getProductByTagFromDatabase,
  updateProductInDatabase,
} from "../firebase/db/product.firestore.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { UploadProductType } from "../models/product.model.js";

const getNormalProducts = asyncHandler(async (_: any, res: any) => {
  try {
    const products = await getAllProductsFromDatabase("products");
    if (!products) throw new ApiError(400, "No products found.");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { products },
          "All products fetched successfully.",
          true
        )
      );
  } catch (err) {
    throw new ApiError(500, "Unable to fetch product information.");
  }
});

const getSpecialProducts = asyncHandler(async (_: any, res: any) => {
  try {
    const products = await getAllProductsFromDatabase("specials");
    if (!products) throw new ApiError(400, "No today's specials found.");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { products },
          "All today's specials fetched successfully.",
          true
        )
      );
  } catch (err) {
    throw new ApiError(500, "Unable to fetch product information.");
  }
});

const getProductByTag = asyncHandler(async (req: any, res: any) => {
  const {
    type,
    category,
  }: { type: "specials" | "products"; category: string } = req.body;
  try {
    const products = await getProductByTagFromDatabase(category, type);
    if (!products)
      throw new ApiError(400, "No product by categories data found");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { products },
          "All today's specials fetched successfully.",
          true
        )
      );
  } catch (err) {
    throw new ApiError(
      500,
      "Unable to fetch product information based on categories."
    );
  }
});

const addProducts = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const response = req.body as UploadProductType;
    try {
      const addingProducts = await addProductToFirestore(
        response.products,
        response.collection
      );
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { addingProducts },
            "Added Product successfully.",
            true
          )
        );
    } catch (error) {
      throw new ApiError(400, "Error while adding new user in database.");
    }
  }
);

const updateProducts = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { category, name, field, newData } = req.body;
    try {
      const updatedProduct = await updateProductInDatabase(
        category,
        field,
        name,
        newData
      );
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
  getNormalProducts,
  getSpecialProducts,
  addProducts,
  updateProducts,
  getProductByTag,
};
