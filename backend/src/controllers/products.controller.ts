import express from "express";
import {
  addProductToFirestore,
  bulkDeleteProductsFromDatabase,
  deleteProductFromDatabase,
  getAllProductsFromDatabase,
  getPopularProductsFromDatabase,
  getProductByTagFromDatabase,
  searchProductInDatabase,
  updateProductInDatabase,
} from "../firebase/db/product.firestore.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { UploadProductType } from "../models/product.model.js";
import { redisClient } from "../utils/Redis.js";

const getPopularProducts = asyncHandler(async (req: any, res: any) => {
  try {
    const products = await getPopularProductsFromDatabase();
    await redisClient.set("popular_products", JSON.stringify(products), {
      EX: 3600,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          products,
          "Popular products fetched successfully.",
          true
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Unable to fetch popular products.",
          null,
          error as string[]
        )
      );
  }
});

const getNormalProducts = asyncHandler(async (req: any, res: any) => {
  const search = req.query.search;
  try {
    let products;
    if (search && search.length > 0) {
      products = await searchProductInDatabase(search);
    } else {
      products = await getAllProductsFromDatabase("products");
      await redisClient.set("products", JSON.stringify(products), {
        EX: 3600,
      });
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          products,
          "All products fetched successfully.",
          true
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Unable to fetch product information.",
          null,
          error as string[]
        )
      );
  }
});

const getSpecialProducts = asyncHandler(async (_: any, res: any) => {
  try {
    const products = await getAllProductsFromDatabase("specials");
    if (!products) throw new ApiError(404, "No today's specials found.");
    await redisClient.set("specials", JSON.stringify(products), {
      EX: 3600,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          products,
          "All today's specials fetched successfully.",
          true
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Unable to fetch special product information.",
          null,
          error as string[]
        )
      );
  }
});

const getProductByTag = asyncHandler(async (req: any, res: any) => {
  const tag = req.params.tag;
  try {
    const products = await getProductByTagFromDatabase(tag, "products");
    if (!products)
      throw new ApiError(404, "No product by categories data found");

    await redisClient.set(`product:${tag}`, JSON.stringify(products), {
      EX: 3600,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          products,
          "Product based on tags are fetched successfully.",
          true
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Unable to fetch product information based on categories.",
          null,
          error as string[]
        )
      );
  }
});

const addProduct = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const response = req.body as UploadProductType;
    try {
      await addProductToFirestore(response.product, response.collection);
      await redisClient.del(response.collection);
      const updatedProductData = await getAllProductsFromDatabase(
        response.collection
      );
      await redisClient.set(
        response.collection,
        JSON.stringify(updatedProductData),
        {
          EX: 3600,
        }
      );
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { updatedProductData },
            "Added Product successfully.",
            true
          )
        );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Error while adding new product in database.",
            null,
            error as string[]
          )
        );
    }
  }
);

const updateProduct = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { category, id, field, newData } = req.body;
    try {
      const updatedProduct = await updateProductInDatabase(
        category,
        field,
        id,
        newData
      );
      await redisClient.del(category);
      const updatedProductData = await getAllProductsFromDatabase(category);
      await redisClient.set(category, JSON.stringify(updatedProductData), {
        EX: 3600,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { updatedProduct, updatedProductData },
            "Product updated successfully.",
            true
          )
        );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Error while updating product.",
            null,
            error as string[]
          )
        );
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
      await redisClient.del(category);
      const updatedProductData = await getAllProductsFromDatabase(category);
      await redisClient.set(category, JSON.stringify(updatedProductData), {
        EX: 3600,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { updatedProductData },
            "Products deleted successfully.",
            true
          )
        );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Error while deleting products.",
            null,
            error as string[]
          )
        );
    }
  }
);

const deleteProduct = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id, type }: { id: string; type: "products" | "specials" } =
      req.body;
    try {
      await deleteProductFromDatabase(id, type);
      await redisClient.del(type);
      const updatedProductData = await getAllProductsFromDatabase(type);
      await redisClient.set(type, JSON.stringify(updatedProductData), {
        EX: 3600,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { updatedProductData },
            "Product deleted successfully.",
            true
          )
        );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Error while deleting product.",
            null,
            error as string[]
          )
        );
    }
  }
);

export {
  getNormalProducts,
  getSpecialProducts,
  addProduct,
  updateProduct,
  getProductByTag,
  deleteProductsInBulk,
  deleteProduct,
  getPopularProducts,
};
