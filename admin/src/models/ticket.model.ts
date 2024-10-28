export interface TicketType {
  id: string;
  category: string;
  title?: string;
  description: string;
  date: string;
  status?: TicketStatus["status"];
  uid?: string;
  createdAt?: any;
  updateAt?: any;
}

export interface TicketModel extends TicketType {
  name: string;
}

export interface GetTicketModal {
  pageSize: number;
  sort: "asc" | "desc";
  direction: "prev" | "next";
  currentFirstDoc?: any | null;
  currentLastDoc?: any | null;
  status?: TicketStatus["status"];
  uid?:string
}

export interface TicketStatus {
  status: "pending" | "progress" | "resolved" | "rejected";
}
