import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { RecentCard } from "../../Components/Card/Card.Recent.Order";
import { getRecentOrder } from "./order";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import Empty from "../../assets/empty.png";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex text-[var(--dark-text)]  flex-col gap-6 bg-[var--light-foreground] px-5 py-4   rounded items-start justify-center">
      <h1 className="sm:text-[25px] text-[21px] tracking-wider font-semibold ">
        Recent Orders
      </h1>
      <div className="flex items-center w-full h-full item-scrollbar   pb-4 gap-5 overflow-x-auto  ">
        {!loading ? (
          data.length > 0 ? (
            data?.map((order) => <RecentCard key={order.id} item={order} />)
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
              <img
                src={Empty}
                alt="No orders found"
                className="size-40 mb-4"
              />
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
    </div>
  );
};
