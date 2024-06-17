import React, { useState } from "react";
import PendingTicket from "../Components/Tickets/PendingTicket";
import ProgressTicket from "../Components/Tickets/ProgressTicket";
import ResolveTicket from "../Components/Tickets/ResolveTicket";
import CancelTicket from "../Components/Tickets/CancelTicket";
import { CirclePlus } from "lucide-react";
import Modal from "../Components/Common/Popup/Popup";
import CreateTicket from "../Components/Upload/CreateTicket";

const TicketPage: React.FC = () => {
  const [closeModal, setCloseModal] = useState<boolean>(true);
  console.log(closeModal)
  return (
    <div className="flex flex-col items-start justify-center gap-10  px-1sm:px-3 py-5">
   
      <div className="flex items-center justify-between w-full ">
      <h1 className="text-[20px] text-[var(--dark-text)] ">Tickets</h1>
        <button onClick={()=>setCloseModal(!closeModal)} className=" flex items-center justify-center gap-1 py-3 rounded px-3  text-sm  text-white bg-[#247f8b]">
          <CirclePlus className="size-5" />
          New Ticket
        </button>
        <Modal close={closeModal} children={<CreateTicket/>} closeModal={()=>setCloseModal(!closeModal)} />
      </div>
      <div className="w-full flex-wrap  flex items-center justify-center gap-1 sm:gap-5">
        <div className="w-full flex items-center justify-center gap-1 sm:gap-5">
          <PendingTicket />
          <ProgressTicket />
        </div>
        <div className="w-full flex items-center justify-center gap-1 sm:gap-5">
          <ResolveTicket />
          <CancelTicket />
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
