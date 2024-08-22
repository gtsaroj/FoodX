import {
  addBannerToFirestore,
  bulkDeleteBannersFromDatabase,
  deleteBannerFromDatabase,
  getBannersFromDatabase,
} from "../firebase/db/banner.firestore.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import express from "express";
import { redisClient } from "../utils/Redis.js";

const addNewBanner = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { title, image } = req.body;
    try {
      await addBannerToFirestore(title, image);
      return res
        .status(200)
        .json(new ApiResponse(200, "", "New banner added successfully", true));
    } catch (error) {
      throw new ApiError(
        501,
        "Error while adding banner.",
        null,
        error as string[]
      );
    }
  }
);

const getAllBanners = asyncHandler(
  async (_: express.Request, res: express.Response) => {
    try {
      const banners = await getBannersFromDatabase();
      await redisClient.set("banners", JSON.stringify(banners), {
        EX: 3600,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(200, banners, "Banners fetched successfully", true)
        );
    } catch (error) {
      throw new ApiError(
        501,
        "Error while fetching banners.",
        null,
        error as string[]
      );
    }
  }
);

const deleteBannersInBulk = asyncHandler(async (req: any, res: any) => {
  const {
    ids,
  }: {
    ids: string[];
  } = req.body;
  try {
    await bulkDeleteBannersFromDatabase(ids);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Banners deleted successfully.", true));
  } catch (error) {
    throw new ApiError(500, "Error while deleting banners.");
  }
});
const deleteBanner = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id } = req.body;
    try {
      const deletedBanner = await deleteBannerFromDatabase(id);
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { deletedBanner },
            "Banner deleted successfully",
            true
          )
        );
    } catch (error) {
      throw new ApiError(
        501,
        "Error while deleting a banner.",
        null,
        error as string[]
      );
    }
  }
);

export { addNewBanner, getAllBanners, deleteBanner, deleteBannersInBulk };
