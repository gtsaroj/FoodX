import express from "express";
import {
  addProductToFirestore,
  bulkDeleteProductsFromDatabase,
  deleteProductFromDatabase,
  getAllProductsFromDatabase,
  getProductByTagFromDatabase,
  getProductsFromDatabase,
  searchProductInDatabase,
  updateProductInDatabase,
} from "../firebase/db/product.firestore.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Product, UploadProductType } from "../models/product.model.js";
import { redisClient } from "../utils/Redis.js";

const getNormalProducts = asyncHandler(async (req: any, res: any) => {
  const search = req.query.search;
  try {
    let products;
    if (search && search.length > 0) {
      products = await searchProductInDatabase(search);
    } else {
      products = await getAllProductsFromDatabase("products");
    }
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
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Unable to fetch product information.",
          null,
          err as string[]
        )
      );
  }
});

const getSpecialProducts = asyncHandler(async (_: any, res: any) => {
  try {
    const products = await getAllProductsFromDatabase("specials");
    if (!products) throw new ApiError(400, "No today's specials found.");
    await redisClient
      .set("specials", JSON.stringify(products), {
        EX: 3600,
      })
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
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Unable to fetch product information.",
          null,
          err as string[]
        )
      );
  }
});

const getProductByTag = asyncHandler(async (req: any, res: any) => {
  const { category }: { category: string } = req.params.tag;
  try {
    const products = await getProductByTagFromDatabase(category, "products");
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
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Unable to fetch product information based on categories."
        )
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
      return res
        .status(500)
        .json(new ApiError(500, "Error while adding new user in database."));
    }
  }
);

const updateProducts = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { category, id, field, newData } = req.body;
    try {
      const updatedProduct = await updateProductInDatabase(
        category,
        field,
        id,
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
      return res
        .status(500)
        .json(new ApiError(500, "Error while updating products."));
    }
  }
);

const deleteProductsInBulk = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const {
      category,
      ids,
    }: {
      category: "products" | "specials";
      ids: string[];
    } = req.body;
    try {
      await bulkDeleteProductsFromDatabase(category, ids);
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Products deleted successfully.", true));
    } catch (error) {
      return res
        .status(500)
        .json(new ApiError(500, "Error while deleting products."));
    }
  }
);

const deleteProduct = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id, type }: { id: string; type: "products" | "specials" } =
      req.body;
    try {
      await deleteProductFromDatabase(id, type);
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Product deleted successfully.", true));
    } catch (error) {
      return res
        .status(500)
        .json(new ApiError(500, "Error while deleting product."));
    }
  }
);

const fetchProducts = asyncHandler(async (req: any, res: any) => {
  let {
    path,
    pageSize,
    filter,
    sort,
    direction,
    currentFirstDoc,
    currentLastDoc,
    category,
  }: {
    path: "products" | "specials";
    pageSize: number;
    filter: keyof Product;
    sort: "asc" | "desc";
    direction: "prev" | "next";
    currentFirstDoc: any | null;
    currentLastDoc: any | null;
    category?: string;
  } = req.body;

  try {
    let { products, firstDoc, lastDoc, length } = await getProductsFromDatabase(
      path,
      pageSize,
      filter,
      sort,
      direction === "next" ? currentLastDoc : null,
      direction === "prev" ? currentFirstDoc : null,
      direction,
      category ? category : undefined
    );
    res.status(200).json(
      new ApiResponse(
        200,
        {
          products,
          currentFirstDoc: firstDoc,
          currentLastDoc: lastDoc,
          length,
        },
        "Successfully fetched products from database",
        true
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Something went wrong while fetching products from database",
          null,
          error as string[]
        )
      );
  }
});

export {
  getNormalProducts,
  getSpecialProducts,
  addProducts,
  updateProducts,
  getProductByTag,
  deleteProductsInBulk,
  deleteProduct,
  fetchProducts,
};
