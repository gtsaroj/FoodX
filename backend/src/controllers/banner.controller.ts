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
    const { title, image, path } = req.body;
    try {
      const { collection } = await addBannerToFirestore(title, image, path);
      await redisClient.del(path);
      const getBanners = await getBannersFromDatabase(collection);
      await redisClient.set(collection, JSON.stringify(getBanners), {
        EX: 3600,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { banner: getBanners, collection },
            "New banner added successfully",
            true
          )
        );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Error while adding banner.",
            null,
            error as string[]
          )
        );
    }
  }
);

const getAllBanners = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    try {
      const path = req.params.path;
      const { banners, collection } = await getBannersFromDatabase(path);
      await redisClient.set(`${path}`, JSON.stringify(banners), {
        EX: 3600,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { banners, collection },
            "Banners fetched successfully",
            true
          )
        );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Error while fetching banners.",
            null,
            error as string[]
          )
        );
    }
  }
);

const deleteBannersInBulk = asyncHandler(async (req: any, res: any) => {
  const {
    ids,
    path,
  }: {
    ids: string[];
    path: string;
  } = req.body;
  try {
    const collection = await bulkDeleteBannersFromDatabase(ids, path);
    await redisClient.del(path);
    const getBanners = await getBannersFromDatabase(collection);
    await redisClient.set(collection, JSON.stringify(getBanners), {
      EX: 3600,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { banner: getBanners, collection },
          "Banners deleted successfully.",
          true
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error while deleting banners.");
  }
});
const deleteBanner = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id, path } = req.body;
    try {
      const collection = await deleteBannerFromDatabase(id, path);
      await redisClient.del(path);
      const getBanners = await getBannersFromDatabase(collection);
      await redisClient.set(collection, JSON.stringify(getBanners), {
        EX: 3600,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { banner: getBanners, collection },
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
