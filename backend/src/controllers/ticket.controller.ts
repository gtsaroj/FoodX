import {
  addTicketToFirestore,
  deleteTicketFromDatabase,
  getTicketsFromFirestore,
  updateTicketInFirestore,
} from "../firebase/db/ticket.firestore.js";
import { Ticket } from "../models/ticket.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import express from "express";

const addNewTicket = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const ticket: Ticket = req.body;

    if (!ticket) throw new ApiError(404, "Ticket not found");
    try {
      await addTicketToFirestore(ticket);
      return res
        .status(200)
        .json(new ApiResponse(200, "", "Ticket fetched successfully", true));
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            error as string[],
            "Error while adding tickets to database.",
            false
          )
        );
    }
  }
);

const updateTicket = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id, newStatus } = req.body;
    if (!id || !newStatus)
      throw new ApiError(
        400,
        "Ticket id and status required to update ticket."
      );
    try {
      await updateTicketInFirestore(id, newStatus);
      return res
        .status(200)
        .json(new ApiResponse(200, "", "Tickets updated successfully", true));
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            error as string[],
            "Error while updating tickets in database.",
            false
          )
        );
    }
  }
);

const deleteTicket = asyncHandler(async (req: any, res: any) => {
  try {
    const id = req.param.id;
    if (!id) throw new ApiError(400, "ID required to delete ticket.");
    await deleteTicketFromDatabase(id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Ticket deleted successfully", true));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error as string[],
          "Error deleting ticket from firestore.",
          false
        )
      );
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
    category,
    uid,
  }: {
    pageSize: number;
    sort: "asc" | "desc";
    direction: "prev" | "next";
    currentFirstDoc: any | null;
    currentLastDoc: any | null;
    status?: "pending" | "resolved" | "cancelled";
    uid?: string;
    category?: string;
  } = req.body;

  try {
    let { tickets, firstDoc, lastDoc, length } = await getTicketsFromFirestore(
      pageSize,
      sort,
      direction === "next" ? currentLastDoc : null,
      direction === "prev" ? currentFirstDoc : null,
      direction,
      status ? status : undefined,
      uid ? uid : undefined,
      category ? category : undefined
    );
    res.status(200).json(
      new ApiResponse(
        200,
        {
          tickets,
          currentFirstDoc: firstDoc,
          currentLastDoc: lastDoc,
          length,
        },
        "Successfully fetched tickets from database",
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
          "Something went wrong while fetching tickets from database",
          false
        )
      );
  }
});

export { addNewTicket, updateTicket, deleteTicket, fetchTickets };
