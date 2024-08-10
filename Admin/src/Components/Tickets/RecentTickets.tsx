import { ChevronRight } from "lucide-react";
import TicketCard from "./TicketCard";
import { useEffect, useRef, useState } from "react";
import { Loader } from "../Common/Loader/Loader";
import { getTicketByStatus } from "../../Services";
import toast from "react-hot-toast";
import { TicketType } from "../../models/ticket.model";
import { getTimeDifference } from "../../Utility/DateUtils";
import Skeleton from "react-loading-skeleton";

export const RecentTickets = () => {
  const [url, seturl] = useState<string>();
  // const [scroll, setScroll] = useState<boolean>(false);
  const [tickets, setTickets] = useState<TicketType[]>([]);

  const fetchTickets = async () => {
    try {
      const tickets = (await getTicketByStatus("Pending")) as TicketType[];
      const sortingTicket = tickets?.sort((a, b) => {
        const timeLeft = getTimeDifference(a.date as any) as any;
        const timeLeft1 = getTimeDifference(b.date as any) as any;
        return timeLeft1 - timeLeft;
      });
      setTickets(sortingTicket);
    } catch (error) {
      toast.error("Unable to fetch ticket");
      throw new Error("Unable to fetch tickets" + error);
    }
  };

  const orderReference = useRef<HTMLDivElement>();

  useEffect(() => {
    // const handleScroll = () => {
    //   if (orderReference.current) {
    //     if (orderReference.current.scrollTop > 0) {
    //       setScroll(true);
    //     } else {
    //       setScroll(false);
    //     }
    //   }
    // };
    // const reference = orderReference.current;
    // reference?.addEventListener("scroll", handleScroll);

    // return () => {
    //   reference?.removeEventListener("scroll", handleScroll);
    // };
    fetchTickets();
  }, []);

  return (
    <div className="flex flex-col w-full h-full p-4 border rounded-lg lg:max-w-[420px]">
      <div className="flex items-center justify-between gap-3 pb-7">
        <h2 className="text-2xl tracking-wide text-nowrap">Recent Tickets</h2>
        <p className="flex items-center justify-center text-[12px] cursor-pointer hover:underline text-[var(--primary-color)] flex-nowrap">
          <span
            className="text-nowrap"
            onClick={() => seturl("contact/tickets")}
          >
            View More
          </span>
          <ChevronRight size={15} />
        </p>
      </div>
      <div
        ref={orderReference as any}
        className={`max-h-[550px] overflow-y-scroll`}
      >
        <div className="flex flex-col items-center justify-center gap-2 py-2 scroll-smooth ">
          {tickets.length > 0 ? (
            tickets?.map((ticket) => (
              <TicketCard
                category={ticket.category}
                date={ticket.date as any}
                description={ticket.description}
                title={ticket.title}
                id={`#${ticket.id}`}
                key={ticket.id}
              />
            ))
          ) : (
            <div className="w-full ">
              <Skeleton className="mb-1" height={100} />
              <Skeleton height={70} count={4} />
            </div>
          )}
        </div>
      </div>
      {url && <Loader url={url} />}
    </div>
  );
};
