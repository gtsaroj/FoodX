import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addNewTicket,
  deleteTicket,
  fetchTickets,
  updateTicket,
} from "../controllers/ticket.controller.js";

const ticketRouter = Router();
ticketRouter.route("/get-tickets").post(verifyJwt, fetchTickets);
ticketRouter.route("/add-ticket").post(verifyJwt, addNewTicket);
ticketRouter.route("/update-ticket").put(verifyJwt, updateTicket);
ticketRouter.route("/:id").delete(verifyJwt, deleteTicket);


export { ticketRouter };
