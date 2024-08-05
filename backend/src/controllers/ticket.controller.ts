import {
  addTicketToFirestore,
  deleteTicketFromDatabase,
  getAllTicketFromFirestore,
  getTicketByStatusFromFirestore,
  getTicketsFromFirestore,
  updateTicketInFirestore,
} from "../firebase/db/ticket.firestore.js";
import { NewTicket } from "../models/ticket.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import express from "express";

const addNewTicket = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const ticket = req.body;
    console.log(ticket);

    if (!ticket) throw new ApiError(400, "Ticket not found");
    try {
      await addTicketToFirestore(ticket);
      return res
        .status(200)
        .json(new ApiResponse(200, "", "Ticket fetched successfully", true));
    } catch (error) {
      throw new ApiError(
        501,
        "Error while adding tickets to database.",
        null,
        error as string[]
      );
    }
  }
);
const getAllTicket = asyncHandler(
  async (_: express.Request, res: express.Response) => {
    try {
      const tickets = await getAllTicketFromFirestore();
      if (!tickets) throw new ApiError(404, "Tickets not founds.");
      return res
        .status(200)
        .json(
          new ApiResponse(200, tickets, "Tickets fetched successfully", true)
        );
    } catch (error) {
      throw new ApiError(
        501,
        "Error while getting tickets from database.",
        null,
        error as string[]
      );
    }
  }
);

const getTicketByStatus = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { status } = req.body;

    try {
      const statusValue: "Pending" | "Resolved" | "Rejected" = status;

      const response = await getTicketByStatusFromFirestore(statusValue);
      if (!response) throw new ApiError(404, "Tickets not founds.");
      return res
        .status(200)
        .json(
          new ApiResponse(200, response, "Ticket by status is fetched.", true)
        );
    } catch (error) {
      throw new ApiError(
        501,
        "Error while getting tickets sorted by status from database.",
        null,
        error as string[]
      );
    }
  }
);
const updateTicket = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const ticket = req.body;
    if (!ticket)
      throw new ApiError(401, "Ticket id and data required to update ticket.");
    try {
      const { id, newStatus } = ticket;
      await updateTicketInFirestore(id, newStatus);
      return res
        .status(200)
        .json(new ApiResponse(200, "", "Tickets updated successfully", true));
    } catch (error) {
      throw new ApiError(
        501,
        "Error while updating tickets in database.",
        null,
        error as string[]
      );
    }
  }
);

const deleteTicket = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.body;
    if (!id) throw new ApiError(401, "ID required to delete ticket.");
    await deleteTicketFromDatabase(id);
    //
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Ticket deleted successfully", true));
  } catch (error) {
    throw new ApiError(400, "Error deleting ticket from firestore.");
  }
});

const fetchTickets = asyncHandler(async (req: any, res: any) => {
  let {
    pageSize,
    sort,
    direction,
    currentFirstDoc,
    currentLastDoc,
    status,
  }: {
    pageSize: number;
    filter: keyof NewTicket;
    sort: "asc" | "desc";
    direction: "prev" | "next";
    currentFirstDoc: any | null;
    currentLastDoc: any | null;
    status?: "Pending" | "Resolved" | "Rejected";
  } = req.body;

  try {
    let { tickets, firstDoc, lastDoc } = await getTicketsFromFirestore(
      pageSize,
      sort,
      direction === "next" ? currentLastDoc : null,
      direction === "prev" ? currentFirstDoc : null,
      direction,
      status ? status : undefined
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { tickets, currentFirstDoc: firstDoc, currentLastDoc: lastDoc },
          "Successfully fetched tickets from database",
          true
        )
      );
  } catch (error) {
    throw new ApiError(
      401,
      "Something went wrong while fetching tickets from database",
      null,
      error as string[]
    );
  }
});

export {
  addNewTicket,
  getAllTicket,
  updateTicket,
  deleteTicket,
  getTicketByStatus,
  fetchTickets,
};
