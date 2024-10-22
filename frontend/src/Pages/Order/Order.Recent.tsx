import { useEffect, useState } from "react";
import { GetOrderModal, Order, UserOrder } from "../../models/order.model";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { RecentCard } from "../../Components/Card/Card.Recent.Order";
import { getOrderByUser } from "../../Services/order.services";
import { aggregateUserOrder } from "./order";

export const RecentOrder = () => {
  const [initialData, setInitialData] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const recentOrder = async ({
    pageSize,
    filter,
    sort,
    currentLastDoc,
    currentFirstDoc,
    direction,
    status,
    userId,
  }: GetOrderModal) => {
    setLoading(true);
    try {
      const response = await getOrderByUser({
        filter: filter,
        pageSize: pageSize,
        sort: sort,
        currentFirstDoc: currentFirstDoc,
        currentLastDoc: currentLastDoc,
        direction: direction,
        status: status,
        userId: userId,
      });
      const userOrder = response.data.orders as Order[];
      const aggregateOrder = aggregateUserOrder(userOrder);
      setInitialData(aggregateOrder);
    } catch (error) {
      throw new Error("Error while fetching recent order" + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    recentOrder({
      filter: "orderRequest",
      pageSize: 5,
      sort: "desc",
      currentFirstDoc: null,
      currentLastDoc: null,
      direction: "next",
    });
  }, []);

  return (
    <div className="w-full h-full flex text-[var(--dark-text)]  flex-col gap-6 bg-[var--light-foreground] px-5 py-4   rounded items-start justify-center">
      <h1 className="sm:text-[25px] text-[21px] tracking-wider font-semibold ">
        Recent Orders
      </h1>
      <div className="flex items-center w-full h-full item-scrollbar   pb-4 gap-5 overflow-x-auto  ">
        {!loading ? (
          initialData?.map((order) => <RecentCard item={order} />)
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
