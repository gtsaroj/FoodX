import { QueryClient } from "react-query";
import {  getUserByUid } from "../../Utility/user.utils";
import { TicketModel, TicketType } from "../../models/ticket.model";
import { User } from "../../models/user.model";

export const aggregateTickets = async(tickets: TicketType[],queryClient: QueryClient) => {
  const userPromises = tickets?.map(async (ticket): Promise<User> => {
    const cachedUser = queryClient.getQueryData(["user", ticket.uid]);
    if (cachedUser) {
      return cachedUser;
    } else {
      return await queryClient.fetchQuery(["user", ticket.uid], () =>
        getUserByUid(ticket.uid as string)
      );
    }
  });
  console.log(userPromises)
  const aggregatePromiseResolveUser = await Promise.all(userPromises);
  

  const allTicket = tickets?.map(async (ticket): Promise<TicketModel> => {
    const findUser = aggregatePromiseResolveUser?.find((user) => user.uid === ticket.uid);
    
  
    return {
      uid: ticket.uid,
      id: ticket.id,
      name: findUser?.fullName as string,
      category: ticket.category,
      title: ticket.title,
      description: ticket.description,
      date: ticket.date,
      status: ticket.status,
    };
  });
  return Promise.all(allTicket);
};
