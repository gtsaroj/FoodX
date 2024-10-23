import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { RecentCard } from "../../Components/Card/Card.Recent.Order";
import { getRecentOrder } from "./order";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";

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

  return (
    <div className="w-full h-full flex text-[var(--dark-text)]  flex-col gap-6 bg-[var--light-foreground] px-5 py-4   rounded items-start justify-center">
      <h1 className="sm:text-[25px] text-[21px] tracking-wider font-semibold ">
        Recent Orders
      </h1>
      <div className="flex items-center w-full h-full item-scrollbar   pb-4 gap-5 overflow-x-auto  ">
        {!loading ? (
          data?.map((order) => <RecentCard key={order.id} item={order} />)
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
    </div>
  );
};
