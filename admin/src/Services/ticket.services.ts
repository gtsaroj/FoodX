import toast from "react-hot-toast";
import { makeRequest } from "../makeRequest";
import {
  GetTicketModal,
  TicketStatus,
  TicketType,
} from "../models/ticket.model";

export const createTicket = async (data: TicketType) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "tickets/add-ticket",
      data: data,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error while creating ticket` + error);
  }
};

export const getTickets = async (data: GetTicketModal) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "tickets/get-tickets",
      data: { ...data },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(`Error while creating ticket` + error);
  }
};

export const deleteTicket = async (data: TicketType) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "tickets/delete-ticket",
      data: data,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error while creating ticket` + error);
  }
};

export const updateTicket = async (data: {
  id: string;
  newStatus: TicketStatus["status"];
}) => {
  try {
    const response = await makeRequest({
      method: "put",
      url: "tickets/update-ticket",
      data: { ...data },
    });
    return response.data;
  } catch (error: any) {
    if (error.response.status === 500) {
      toast.error("Internal server error. Please try again later.");
    }
    throw new Error(`Error while creating ticket` + error);
  }
};
