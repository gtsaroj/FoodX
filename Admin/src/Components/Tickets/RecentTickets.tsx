import { ChevronRight } from "lucide-react";
import TicketCard from "./TicketCard";

export const RecentTickets = () => {
  return (
    <div className="flex flex-col w-full h-full p-4 border rounded-lg lg:max-w-[420px]">
      <div className="flex items-center justify-between gap-3 pb-7">
        <h2 className="text-2xl tracking-wide text-nowrap">Recent Tickets</h2>
        <p className="flex items-center justify-center text-[12px] cursor-pointer hover:underline text-[var(--primary-color)] flex-nowrap">
          <span className="text-nowrap">View More</span>
          <ChevronRight size={15} />
        </p>
      </div>
      <div className="max-h-[550px] overflow-y-scroll ">
        <div className="flex flex-col items-center justify-center gap-2 py-2 scroll-smooth ">
          <TicketCard />
          <TicketCard />
          <TicketCard />
          <TicketCard />
          <TicketCard />
          <TicketCard />
        </div>
      </div>
    </div>
  );
};
