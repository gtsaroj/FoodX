import React from "react";

const TicketCard: React.FC = () => {
  return (
    <div className="container flex  gap-2 flex-col items-start justify-center bg-[var(--light-foreground)] rounded px-3 py-2 border-[#8a849570] ">
      <div className=" w-full flex items-center justify-between">
        {" "}
        <h1 className="text-[10px] py-0.5 px-1 rounded-sm border-[1px] text-[#247f8b] border-[#247f8b] ">
          #871893939
        </h1>
        {/* <div className="bg-red-600 text-[10px] text-white px-3 py-0.5 rounded-sm ">High</div> */}
      </div>
      <h3 className="text-[14px]">
        Subject with longer names so probably 3 lines should be visibile on this
        card
      </h3>
      <span className="text-[12px] text-[var(--dark-text)] ">3 mins ago</span>
    </div>
  );
};

export default TicketCard;
