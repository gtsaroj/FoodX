import React from "react";
import TicketCard from "./TicketCard";

const CancelTicket: React.FC = () => {
  return (
    <div className="flex flex-col px-3 py-2 items-start gap-2  justify-center rounded-md bg-[#8a849570] ">
      <h1 className="text-[15px] text-[var(--dark-text)] ">Cancel</h1>
      <div className="w-full flex flex-col items-center justify-center gap-2">
        <TicketCard />
        <TicketCard />
        <TicketCard />
      </div>
    </div>
  );
};

export default CancelTicket;
