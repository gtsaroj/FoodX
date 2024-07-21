export interface TicketType {
  id?: string;
  category: string;
  title: string;
  description: string;
  date: Date | string;
  status: string;
  uid: string;
}
