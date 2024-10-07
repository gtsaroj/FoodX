import { getFullName } from "../../Utility/user.utils";
import { TicketModel, TicketType } from "../../models/ticket.model";

export const aggregateTickets = (tickets: TicketType[]) => {
  const allTicket = tickets?.map(async (ticket): Promise<TicketModel> => {
    const user = await getFullName(ticket.uid as string);
    return {
      id: ticket.id,
      name: user as string,
      category: ticket.category,
      title: ticket.title,
      description: ticket.description,
      date: ticket.date,
      status: ticket.status,
    };
  });
  return Promise.all(allTicket);
};
