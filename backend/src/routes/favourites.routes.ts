import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addFavourite,
  getFavourites,
  removeFavourites,
} from "../controllers/favourites.controller.js";
import { cacheMiddleware } from "../middlewares/redis.middleware.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";

const favouriteRouter = Router();

favouriteRouter
  .route("/add")
  .post(rateLimiter(60, 30), verifyJwt, addFavourite);
favouriteRouter
  .route("/remove")
  .delete(rateLimiter(60, 20), verifyJwt, removeFavourites);
favouriteRouter
  .route("/:uid")
  .get(
    verifyJwt,
    cacheMiddleware("favourites"),
    getFavourites
  );

export default favouriteRouter;
