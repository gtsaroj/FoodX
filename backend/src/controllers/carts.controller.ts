import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import express from "express";
import { redisClient } from "../utils/Redis.js";
import {
  addCartInFirestore,
  removeItemFromCart,
  getCartsFromFirestore,
} from "../firebase/db/cart.firestore.js";

const addCarts = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { uid, productId } = req.body;
    try {
      await addCartInFirestore(uid, productId);
      await redisClient.del(`carts:${uid}`);
      const updatedCart = await getCartsFromFirestore(uid);
      await redisClient.set(`carts:${uid}`, JSON.stringify(updatedCart), {
        EX: 600,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            updatedCart,
            "Item successfully added into cart.",
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
            "Error while adding item into carts.",
            false
          )
        );
    }
  }
);

const removeCarts = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    try {
      const { uid, productId } = req.body;
      await removeItemFromCart(uid, productId);
      await redisClient.del(`carts:${uid}`);
      const updatedCart = await getCartsFromFirestore(uid);
      await redisClient.set(`carts:${uid}`, JSON.stringify(updatedCart), {
        EX: 600,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            updatedCart,
            "Item successfully removed from carts.",
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
            "Error while removing item from carts.",
            false
          )
        );
    }
  }
);

const getCarts = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    try {
      const uid = req.params.uid;
      const cartsData = await getCartsFromFirestore(uid);
      await redisClient.setEx(`carts:${uid}`, 600, JSON.stringify(cartsData));
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            cartsData,
            "Cart items successfully fetched.",
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
            "Error while fetching item from carts.",
            false
          )
        );
    }
  }
);

export { addCarts, removeCarts, getCarts };
