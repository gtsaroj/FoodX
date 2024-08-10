export interface TicketType {
  id?: string;
  category: string;
  title: string;
  description: string;
  date: Date | string;
  status?: "Pending" | "Progress" | "Resolved" | "Rejected";
  uid: string;
}
export interface GetTicketModal {
  pageSize: number;
  sort: "asc" | "desc";
  direction: "prev" | "next";
  currentFirstDoc?: any | null;
  currentLastDoc?: any | null;
  status?: "Pending" | "Progress" | "Resolved" | "Rejected";
}

export type TicketState = "Pending" | "Progress" | "Resolved" | "Rejected";
