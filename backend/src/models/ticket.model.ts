export interface Ticket {
  uid: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "resolved" | "cancelled";
  date: Date;
}
export interface NewTicket extends Ticket {
  id: string;
}

export interface TicketInfo extends Ticket {
  createdAt: any;
  upadtedAt: any;
}
