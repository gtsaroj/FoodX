import { getChefDetails } from "../../Utility/user.utils";
import { TicketModel, TicketType } from "../../models/ticket.model";

export const aggregateTickets = (tickets: TicketType[]) => {
  console.log(tickets)
  const allTicket = tickets?.map(async (ticket): Promise<TicketModel> => {
    const user = await getChefDetails(ticket.uid as string);
    return {
      uid: ticket.uid,
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
