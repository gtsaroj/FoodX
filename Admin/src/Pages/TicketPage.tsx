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

const TicketPage: React.FC = () => {
  const [ticketState, setTicketState] = useState<string>();
  const [initialIndex, setInitialIndex] = useState<number>();
  const [closeModal, setCloseModal] = useState<boolean>(true);

  function handleClick(item: string) {
    setTicketState(item as string);
    setInitialIndex(index);
  }

  useEffect(() => {
    setTicketState("Pending");
  }, []);

  const ticketStateLower = ticketState?.toLowerCase();
  const component = ticketStateLower && TicketComponents[ticketStateLower];
  return (
    <div className="flex flex-col items-start justify-center gap-7  px-1sm:px-3 py-5">
      <div className="flex items-center justify-between w-full ">
        <h1 className="text-[25px] brightness-125 contrast-125 font-[600] text-[var(--dark-text)] ">
          Tickets
        </h1>
        <button
          onClick={() => setCloseModal(!closeModal)}
          className="flex gap-1 text-[var(--light-text)] bg-[var(--primary-color)] px-5 py-3 rounded items-center justify-center"
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
      <div className="w-full pt-10 grid grid-cols-4 gap-2 sm:gap-6">
        {/* /
           className={`${ item === "Pending" ? "bg-[var(--primary-light)]" : item === "Progress" ? "bg-[var(--orange-bg)]" : item === "Resolve" ? "bg-[var(--green-bg)] " : item === "Cancel" ? "bg-[var(--danger-bg)]":'' } ${initialIndex === index ? "shadow-inner shadow-black  duration-200" : ""}`}
          //   onClick={() => handleClick(item, index)}
          //   key={index}
          // >
          //   {item}
          // </button> */}
        <button
          onClick={() => handleClick("pending")}
          className={`${
            ticketState === "pending" ? "bg-[var(--primary-dark)]" : ""
          } py-3 sm:text-[15px] bg-[var(--primary-light)]  text-sm duration-150   font-[550] contrast-150 rounded text-[var(--light-text)]`}
        >
          Pending
        </button>
        <button
          onClick={() => handleClick("progress")}
          className={` py-3 sm:text-[15px]  bg-[var(--orange-bg)]  duration-150 text-sm  font-[550] contrast-150 rounded text-[var(--light-text)] ${
            ticketState === "progress" ? "bg-[#bb8115]" : ""
          } `}
        >
          Progress
        </button>
        <button
          onClick={() => handleClick("resolve")}
          className={`py-3 sm:text-[15px] duration-150   bg-[var(--green-bg)] ${
            ticketState === "resolve" ? "bg-[#287e28fd]" : ""
          }  text-sm  font-[550] contrast-150 rounded text-[var(--light-text)] `}
        >
          Resolve
        </button>
        <button
          onClick={() => handleClick("cancel")}
          className={`py-3 sm:text-[15px] duration-150   bg-[var(--danger-bg)] ${
            ticketState === "cancel" ? "bg-[#a82d2dfd]" : ""
          }  text-sm  font-[550] contrast-150 rounded text-[var(--light-text)] `}
        >
          Cancel
        </button>
      </div>
      {/* Employee Card */}
      <div className="w-full">{component ? component : ""}</div>
      <div className="w-full flex flex-col items-start justify-center gap-9">
        <h1 className="text-3xl contrast-125 ">
          <span className="text-[#c79d2a] brightness-100 contrast-100 font-[570]">
            32
          </span>{" "}
          <span className="text-2xl brightness-100 contrast-100 font-[570] ">
            Employee
          </span>
        </h1>
        <div className="w-full grid sm:grid-cols-2 sm:gap-x-6 grid-cols-1  place-items-center lg:grid-cols-3 gap-y-6 ">
          <EmployeeCard />
          <EmployeeCard />
          <EmployeeCard />
          <EmployeeCard />
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
