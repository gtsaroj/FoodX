import { ChevronRight, Frown } from "lucide-react";

import { useEffect, useState } from "react";
import { Loader } from "../Common/Loader/Loader";
import {
  GetOrderModal,
  Order,
  OrderModal,
  RecentOrder,
} from "../../models/order.model";
import Skeleton from "react-loading-skeleton";
import { getOrders } from "../../Services/order.services";
import { OrderCard } from "../Common/Cards/ OrderCard";
import EmptyLogo from "../../assets/empty.png";
import { Empty } from "../Common/Empty/Empty";

export const RecentOrders = () => {
  const [url, setUrl] = useState<string>();
  const [recentOrder, setRecentOrder] = useState<RecentOrder[]>([]);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
  }>({ currentPage: 1, perPage: 3 });
  const [loading, setLoading] = useState<boolean>(false);
  const getRecentOrder = async ({
    pageSize,
    filter,
    sort,
    currentFirstDoc,
    currentLastDoc,
    direction,
    status,
  }: GetOrderModal) => {
    setLoading(true);
    try {
      const response = await getOrders({
        pageSize: pageSize,
        sort: sort,
        currentFirstDoc: currentFirstDoc,
        currentLastDoc: currentLastDoc,
        direction: direction,
        status: status,
        filter: filter as keyof Order,
      });
      console.log(response);
    } catch (error) {
      throw new Error("Error while fetching recent orders" + error);
    }
    setLoading(false);
  };
  const [isClicked, setIsClicked] = useState<boolean>(false);
  useEffect(() => {
    getRecentOrder({
      pageSize: pagination.perPage,
      sort: "desc",
      currentFirstDoc: null,
      currentLastDoc: null,
      direction: "next",
      filter: "orderRequest",
    });
  }, [pagination.perPage, isClicked]);

  return (
    <div className="flex flex-col px-2 py-4 w-full h-full  lg:max-w-[600px]">
      <div className="flex items-center justify-between pb-7">
        <h2 className="text-2xl text-[var(--dark-text)] tracking-wide text-nowrap">
          Recent Orders
        </h2>
        <p className="flex items-center justify-center text-[12px] cursor-pointer hover:underline text-[var(--primary-color)] flex-nowrap">
          <span className="text-nowrap" onClick={() => setUrl("order-list")}>
            View More
          </span>
          <ChevronRight size={15} />
        </p>
      </div>
      <div
        className={`duration-200 max-h-[550px] scrollbar-custom px-5 overflow-y-scroll
         `}
      >
        <div className="flex flex-col items-center justify-center gap-2 py-2 scroll-smooth ">
          {!loading ? (
            recentOrder.length > 0 ? (
              recentOrder?.map((order, index) => (
                <OrderCard
                  image={order.image}
                  orderId={order.orderId}
                  price={order.price}
                  orderRequest={order.orderRequest}
                  products={order.products}
                  status={order.status}
                  key={index}
                />
              ))
            ) : (
              <Empty
                action={() => setIsClicked(!isClicked)}
                children="No recent orders available"
              />
            )
          ) : (
            <div className="w-full ">
              <Skeleton
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                height={70}
                count={8}
              />
            </div>
          )}
        </div>
      </div>
      {url && <Loader url={`${url}/`} />}
    </div>
  );
};
