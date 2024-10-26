import { ChevronRight } from "lucide-react";
import TicketCard from "./TicketCard";
import { useEffect, useRef, useState } from "react";
import { Loader } from "../Common/Loader/Loader";
import TicketLogo from "../../assets/tickets.png";
import toast from "react-hot-toast";
import { TicketType } from "../../models/ticket.model";

import Skeleton from "react-loading-skeleton";
import { Empty } from "../Common/Empty/Empty";
import { getTickets } from "../../Services/ticket.services";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import { useQuery } from "react-query";

export const RecentTickets = () => {
  const [url, seturl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  const fetchTickets = async (): Promise<TicketType[]> => {
    try {
      const tickets = (await getTickets({
        pageSize: 5,
        direction: "next",
        sort: "desc",
        currentFirstDoc: null,
        currentLastDoc: null,
      })) as { tickets: TicketType[] };
      return tickets.tickets;
    } catch (error) {
      toast.error("Unable to fetch ticket");
      throw new Error("Unable to fetch tickets" + error);
    }
  };

  const { data: tickets, isLoading } = useQuery("recentTickets", fetchTickets, {
    refetchOnWindowFocus: false,
    cacheTime: 2 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
  });

  const user = useSelector((state: RootState) => state.root.user.userInfo);

  const orderReference = useRef<HTMLDivElement>();

  // useEffect(() => {
  //   setLoading(true);
  //   fetchTickets();
  //   setLoading(false);
  // }, [isRefresh]);

  return (
    <div className="flex  flex-col text-[var(--dark-text)] w-full h-full p-4 border-[var(--dark-border)] border-[1px] rounded-lg lg:max-w-[420px]">
      <div className="flex items-center justify-between gap-3 pb-7">
        <h2 className="text-2xl tracking-wide text-nowrap">Recent Tickets</h2>
        <p className="flex items-center justify-center text-[12px] cursor-pointer hover:underline text-[var(--primary-color)] flex-nowrap">
          <span
            className="text-nowrap"
            onClick={() =>
              user.role === "admin"
                ? seturl("contact/admin-tickets")
                : seturl("contact/chef-tickets")
            }
          >
            View More
          </span>
          <ChevronRight size={15} />
        </p>
      </div>
      <div
        ref={orderReference as any}
        className={`max-h-[550px]  scrollbar-custom scroll-smooth px-6 overflow-y-scroll`}
      >
        <div className="flex flex-col w-full h-full items-center  gap-2 py-2  ">
          {!isLoading ? (
            tickets && tickets?.length > 0 ? (
              tickets?.map((ticket) => (
                <TicketCard
                  category={ticket.category}
                  date={ticket.date as any}
                  description={ticket.description}
                  title={ticket.title}
                  id={`${ticket.id}`}
                  key={ticket.id}
                />
              ))
            ) : (
              <Empty
                actionText="Refresh ticket"
                parent={TicketLogo}
                style={{ width: "15rem", height: "12rem" }}
                action={() => setIsRefresh(!isRefresh)}
                children="No recent tickets available"
              />
            )
          ) : (
            <div className="w-full ">
              <Skeleton
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                height={70}
                count={6}
              />
            </div>
          )}
        </div>
      </div>
      {url && <Loader url={url} />}
    </div>
  );
};
