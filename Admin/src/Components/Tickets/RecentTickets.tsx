import { ChevronRight } from "lucide-react";
import TicketCard from "./TicketCard";
import { useEffect, useRef, useState } from "react";
import { Loader } from "../Common/Loader/Loader";

export const RecentTickets = () => {
  const [url, seturl] = useState<string>();
  const [scroll, setScroll] = useState<boolean>(false);

  const orderReference = useRef<HTMLDivElement>();

  useEffect(() => {
    const handleScroll = () => {
      if (orderReference.current) {
        if (orderReference.current.scrollTop > 0) {
          setScroll(true);
        } else {
          setScroll(false);
        }
      }
    };
    const reference = orderReference.current;
    reference?.addEventListener("scroll", handleScroll);

    return () => {
      reference?.removeEventListener("scroll", handleScroll);
    };
  });

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
        className={`max-h-[550px] overflow-y-scroll ${
          scroll ? "top-shadow" : ""
        } `}
      >
        <div className="flex flex-col items-center justify-center gap-2 py-2 scroll-smooth ">
          <TicketCard />
          <TicketCard />
          <TicketCard />
          <TicketCard />
          <TicketCard />
          <TicketCard />
        </div>
      </div>
      {url && <Loader url={url} />}
    </div>
  );
};
