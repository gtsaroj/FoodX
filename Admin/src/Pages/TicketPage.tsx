import React, { useEffect, useState } from "react";
import PendingTicket from "../Components/Tickets/PendingTicket";
import ProgressTicket from "../Components/Tickets/ProgressTicket";
import ResolveTicket from "../Components/Tickets/ResolveTicket";
import CancelTicket from "../Components/Tickets/CancelTicket";
import { CirclePlus } from "lucide-react";
import Modal from "../Components/Common/Popup/Popup";
import CreateTicket from "../Components/Upload/CreateTicket";
import { EmployeeCard } from "../Components/Common/Cards/EmployeeCard";

// interface ButtonProp {
//   title: string[];
//   style?: ReactNode;
// }

const TicketComponents = {
  pending: <PendingTicket />,
  progress: <ProgressTicket />,
  resolve: <ResolveTicket />,
  cancel: <CancelTicket />,
};
const Buttons = ["Pending", "Progress", "Resolve", "Cancel"];

const TicketPage: React.FC = () => {
  const [ticketState, setTicketState] = useState<string>();
  const [initialIndex, setInitialIndex] = useState<number>();
  const [closeModal, setCloseModal] = useState<boolean>(true);

  function handleClick(item: string, index: number) {
    setTicketState(item as string);
    setInitialIndex(index);
  }

  useEffect(() => {
    setTicketState("Pending");
  }, []);

  const ticketStateLower = ticketState?.toLowerCase();
  const component = ticketStateLower && TicketComponents[ticketStateLower];
  return (
    <div className="flex flex-col items-start justify-center gap-10  px-1sm:px-3 py-5">
      <div className="flex items-center justify-between w-full ">
        <h1 className="text-[20px] text-[var(--dark-text)] ">Tickets</h1>
        <button
          onClick={() => setCloseModal(!closeModal)}
          className=" flex items-center justify-center gap-1 py-3 rounded px-3  text-sm  text-white bg-[#247f8b]"
        >
          <CirclePlus className="size-5" />
          New Ticket
        </button>
        <Modal
          close={closeModal}
          children={<CreateTicket />}
          closeModal={() => setCloseModal(!closeModal)}
        />
      </div>
      <div className="w-full flex flex-col items-start justify-center gap-9">
        <h1 className="text-3xl contrast-125 " ><span className="text-[#e0b43a]">32</span> Employee</h1>
        <div className="w-full grid sm:grid-cols-2 sm:gap-x-6 grid-cols-1  place-items-center lg:grid-cols-3 gap-y-6 ">
        <EmployeeCard />
        <EmployeeCard />
        <EmployeeCard />
        <EmployeeCard/>
      </div>
      </div>
      <div className="w-full pt-10 grid grid-cols-4 gap-2 sm:gap-6">
        {Buttons?.map((item, index) => (
          <button
            className={` py-3 sm:text-[15px] text-sm  font-[550] contrast-150 rounded text-[var(--light-text)] ${ item === "Pending" ? "bg-[var(--primary-light)]" : item === "Progress" ? "bg-[var(--orange-bg)]" : item === "Resolve" ? "bg-[var(--green-bg)] " : item === "Cancel" ? "bg-[var(--danger-bg)]":'' } ${initialIndex === index ? "shadow-inner shadow-black  duration-200" : ""}`}
            onClick={() => handleClick(item, index)}
            key={index}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="w-full">{component ? component : ""}</div>
    </div>
  );
};

export default TicketPage;
