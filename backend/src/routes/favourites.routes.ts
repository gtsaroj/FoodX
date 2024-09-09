import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addFavourite,
  getFavourites,
  removeFavourites,
} from "../controllers/favourites.controller.js";
import { cacheMiddleware } from "../middlewares/redis.middleware.js";

const favouriteRouter = Router();

favouriteRouter.route("/add").post(addFavourite);
favouriteRouter.route("/remove").delete(removeFavourites);
favouriteRouter
  .route("/:uid")
  .get(cacheMiddleware("favourites"), getFavourites);

export default favouriteRouter;
