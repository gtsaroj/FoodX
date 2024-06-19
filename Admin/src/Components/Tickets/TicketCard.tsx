import React from "react";

const TicketCard: React.FC = () => {
  return (
    <div className="container flex border-b-[1px] pb-5  gap-2.5 flex-col items-start justify-center bg-[var(--light-foreground)]  px-3 py-4 border-[#8a849570] ">
      <div className=" w-full flex items-center justify-between">
        <div className="flex flex-col items-start justify-center gap-2.5">
          <h1 className="text-[15px] border-[1px] border-[var(--danger-bg)] py-1 px-2 rounded ">
            General Inquiry
          </h1>
          <h2 className="text-[14px] font-[600] ">Leave for one day</h2>
        </div>
        <h3 className="text-[10px] py-0.5 px-1 rounded border-[1px] text-[#247f8b] border-[#247f8b] ">
          #871893939
        </h3>
        {/* <div className="bg-red-600 text-[10px] text-white px-3 py-0.5 rounded-sm ">High</div> */}
      </div>
      <h3 className="text-[14px] ">
        Subject with longer names so probably 3 lines should be visibile on this
        card
      </h3>
      <span className="text-[12px] text-[var(--dark-text)] ">3 mins ago</span>
    </div>
  );
};

export default TicketCard;
