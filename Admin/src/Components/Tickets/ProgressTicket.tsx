import React from "react";
import TicketCard from "./TicketCard";
import { TicketType } from "../../models/ticket.model";
import Skeleton from "react-loading-skeleton";
import NotFound from "../NotFound/NotFound";
interface ProgressProp {
  prop: TicketType[];
  loading: boolean;
}

const ProgressTicket: React.FC<ProgressProp> = ({ prop, loading }) => {
  return loading ? (
    <div className="w-full ">
      <Skeleton className="mb-8" height={100} />
      <Skeleton height={70} count={4} />
    </div>
  ) : prop?.length > 0 ? (
    <div className="flex flex-col px-2 sm:px-3 py-2 items-start gap-2  justify-center rounded ">
      <div className="w-full border-b-[1px] pb-5 flex items-center justify-between px-2">
        <h1 className="text-[18px] text-[var(--dark-text)] ">Progress</h1>
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-2">
        {prop?.map((ticket) => (
          <TicketCard
            category={ticket.category}
            date={ticket.date as any}
            description={ticket.description}
            title={ticket.title}
            id={ticket.id}
            key={ticket.id}
          />
        ))}
      </div>
    </div>
  ) : (
    <NotFound />
  );
};

export default ProgressTicket;
