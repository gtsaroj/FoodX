import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addNewTicket,
  deleteTicket,
  getAllTicket,
  getTicketByStatus,
  updateTicket,
} from "../controllers/ticket.controller.js";

const ticketRouter = Router();

//secured routes
// ticketRouter.route("/all").get(verifyJwt, sendAllProducts);
// ticketRouter.route("/specials").get(verifyJwt, sendSpecialProducts);
ticketRouter.route("/get-ticket").get(verifyJwt, getAllTicket);
ticketRouter.route("/add-ticket").post(verifyJwt, addNewTicket);
ticketRouter.route("/update-ticket").put(verifyJwt, updateTicket);
ticketRouter.route("/get-ticket-status").post(verifyJwt,getTicketByStatus);
ticketRouter.route("/delete-ticket").delete(verifyJwt, deleteTicket);

// admin-only secured routes

export { ticketRouter };
