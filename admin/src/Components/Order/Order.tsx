import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Loader } from "../Common/Loader/Loader";
import { Order } from "../../models/order.model";
import Skeleton from "react-loading-skeleton";
import { OrderCard } from "../Common/Cards/ OrderCard";
import { Empty } from "../Common/Empty/Empty";
import { getUserByUid } from "../../Utility/user.utils";
import Bell from "../../assets/order.mp3";
import { useSocket } from "../../Utility/socket.util";
import { customToast } from "../Toast/Toast";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import { aggregateOrders, usePaginateOrders } from "../../Pages/Order/order";

export const RecentOrders = () => {
  const [url, setUrl] = useState<string>();

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const { initialOrders, setInitialOrders, loading } = usePaginateOrders(
    {
      pageSize: 5,
      sort: "desc",
      status: "pending",
    },
    { refresh: isClicked }
  );

  const store = useSelector((state: RootState) => state.root);

  const { socket } = useSocket(store?.user?.success);

  useEffect(() => {
    const handleNewOrder = async (order: Order) => {
      const user = await getUserByUid(order.uid as string);
      const aggregateOrder = aggregateOrders([order]);
      const promiseResolve = await Promise.all(aggregateOrder);
      setInitialOrders((prev) => [...promiseResolve, ...prev]);
      const audio = new Audio(Bell);
      audio.play();
      customToast({
        orderId: order.orderId,
        products: order.products,
        orderRequest: order.orderRequest,
        name: user?.fullName as string,
        note: order.note as string,
      });
    };

    // Listen for the 'new_order' event
    socket?.on("new_order", handleNewOrder);

    // Cleanup listener when component unmounts
    return () => {
      socket?.off("new_order", handleNewOrder);
    };
  }, [socket, setInitialOrders]);

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
            initialOrders.length > 0 ? (
              initialOrders?.map((order, index) => (
                <OrderCard
                  uid={order?.uid}
                  image={order?.image}
                  orderId={order?.id as string}
                  price={order.products?.reduce(
                    (productAcc, product) =>
                      productAcc +
                      Number(product.price) * Number(product.quantity),
                    0
                  )}
                  orderRequest={order?.orderRequest}
                  products={order?.products?.map(
                    (product) => ` ${product.name} × ${product.quantity}, `
                  )}
                  status={order?.status}
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
