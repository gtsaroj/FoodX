import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { addNewTicket, deleteTicket, getAllTicket, updateTicket } from "../controllers/ticket.controller.js";


const ticketRouter = Router();

//secured routes
// ticketRouter.route("/all").get(verifyJwt, sendAllProducts);
// ticketRouter.route("/specials").get(verifyJwt, sendSpecialProducts);
ticketRouter.route("/get-ticket").get(getAllTicket)
ticketRouter.route("/add-ticket").post(addNewTicket);
ticketRouter.route("/update-ticket").put(updateTicket);
ticketRouter.route("/delete-ticket").delete( deleteTicket);


// admin-only secured routes



export { ticketRouter };
