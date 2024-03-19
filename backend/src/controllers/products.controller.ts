import { getAllProducts } from "../firebase/db/product.firestore.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const sendAllProducts = asyncHandler(async (_: any, res: any) => {
  try {
    const products = await getAllProducts("products");
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

const sendSpecialProducts = asyncHandler(async (_: any, res: any) => {
  try {
    const products = await getAllProducts("specials");
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

export { sendAllProducts, sendSpecialProducts };
