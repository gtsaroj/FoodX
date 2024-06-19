import React from "react";
import TicketCard from "./TicketCard";

const CancelTicket: React.FC = () => {
  return (
    <div className="flex flex-col px-2 sm:px-3 py-2 items-start gap-2  justify-center rounded ">
      <div className="w-full border-b-[1px] pb-5 flex items-center justify-between px-2">
        <h1 className="text-[18px] text-[var(--dark-text)] ">Cancel</h1>
        <p className="text-sm hover:underline w-full text-end cursor-pointer">
          View more
        </p>
      </div>
      <div className="w-full flex rounded flex-col items-center justify-center gap-2">
        <TicketCard />
        <TicketCard />
        <TicketCard />
      </div>
    </div>
  );
};

export default CancelTicket;
