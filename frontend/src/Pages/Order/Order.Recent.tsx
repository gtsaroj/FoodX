import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { RecentCard } from "../../Components/Card/Card.Recent.Order";
import { getRecentOrder } from "./order";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import Empty from "../../assets/empty.png";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const RecentOrder = () => {
  const store = useSelector((state: RootState) => state.root);

  const { data, loading } = getRecentOrder({
    pageSize: 5,
    currentFirstDoc: null,
    currentLastDoc: null,
    direction: "next",
    filter: "orderRequest",
    userId: store?.auth?.userInfo?.uid as string,
  });

  const recentCardReference = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  return (
    <div className="w-full relative group/recent h-full flex text-[var(--dark-text)]  flex-col gap-6 bg-[var--light-foreground] px-5 py-4   rounded items-start justify-center">
      <h1 className="sm:text-[25px] text-[21px] tracking-wider font-semibold ">
        Recent Orders
      </h1>
      <div
        ref={recentCardReference}
        className="flex items-center w-full h-full item-scrollbar   pb-4 gap-5 overflow-x-auto  "
      >
        {!loading ? (
          data.length > 0 ? (
            data?.map((order) => <RecentCard key={order.id} item={order} />)
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
              <img src={Empty} alt="No orders found" className="size-40 mb-4" />
              <h4 className="text-xl text-[var(--dark-secondary-text)] mb-2">
                No recent orders found
              </h4>
              <p className="text-sm text-[var(--dark-secondary-text)] mb-4">
                It looks like you haven't placed any recent orders.
              </p>
              <button
                onClick={() => navigate("/#categories")}
                className="mt-4 bg-[var(--primary-light)] text-white py-2 duration-150 px-4 rounded hover:bg-[var(--primary-dark)]"
              >
                Browse Categories
              </button>
            </div>
          )
        ) : (
          <div className="w-full gap-4 flex ">
            <Skeleton
              height={230}
              width={330}
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
            <Skeleton
              height={230}
              width={330}
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
            <Skeleton
              height={230}
              width={330}
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
            <Skeleton
              height={230}
              width={330}
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
          </div>
        )}
      </div>
      {data?.length > 0 && (
        <div className="w-full -translate-x-5 invisible group-hover/recent:visible opacity-0 group-hover/recent:opacity-100 duration-200 absolute z-50 top-36   flex justify-between">
          <button
            onClick={() => {
              recentCardReference.current?.scrollBy({
                behavior: "smooth",
                left: -300,
              });
            }}
            className=" bg-[#99969680] p-2.5 hover:bg-[#94909080] duration-150 text-[var(--dark-text)] rounded-full "
          >
            <ChevronLeft className="sm:size-6 size-5 " />
          </button>
          <button
            onClick={() => {
              recentCardReference.current?.scrollBy({
                behavior: "smooth",
                left: 300,
              });
            }}
            className=" bg-[#99969680] p-2.5 hover:bg-[#94909080] duration-150  text-[var(--dark-text)] rounded-full "
          >
            <ChevronRight className="sm:size-6 size-5 " />
          </button>
        </div>
      )}
    </div>
  );
};
