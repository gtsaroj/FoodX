import React from "react";
import TicketCard from "./TicketCard";

const ProgressTicket = () => {
  return (
    <div className="flex flex-col px-2 sm:px-3 py-2 items-start gap-2  justify-center rounded bg-[#8a849570] ">
      <h1 className="text-[15px] text-[var(--dark-text)] ">Progress</h1>
      <div className="w-full flex flex-col items-center justify-center gap-2">
        <TicketCard />
        <TicketCard />
        <TicketCard />
      </div>
      <p className="text-sm hover:underline w-full text-end cursor-pointer">View more</p>
    </div>
  );
};

export default ProgressTicket;
