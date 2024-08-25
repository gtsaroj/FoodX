import { makeRequest } from "../makeRequest";
import { GetTicketModal, TicketType } from "../models/ticket.model";

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
export const getTicket = async (ticketState: string) => {
  let request = 5;
  console.log(request);
  if (request < 0) throw new Error("Time finished");
  try {
    request = -1;
    const response = await makeRequest({
      method: "post",
      url: "tickets/get-ticket-status",
      data: { status: ticketState },
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

export const updateTicket = async (data: TicketType) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "tickets/update-ticket",
      data: data,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error while creating ticket` + error);
  }
};
