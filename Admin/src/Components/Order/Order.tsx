import { ChevronRight } from "lucide-react";
import { OrderCard } from "../Common/Cards/ OrderCard";
import { useEffect, useState } from "react";
import { Loader } from "../Common/Loader/Loader";
import { getRecentOrders } from "./Order";
import { RecentOrderType } from "../../models/order.model";

export const RecentOrders = () => {
  const [url, setUrl] = useState<string>();
  const [recentOrder, setRecentOrder] = useState<RecentOrderType[]>();

  console.log(recentOrder)

  //  scroller check
  // const [scroll, setScroll] = useState<boolean>(false);
  // const orderReference = useRef<HTMLDivElement>();
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

  useEffect(() => {
    (async () => {
      const recentOrders = await getRecentOrders();
  

      if (recentOrders) setRecentOrder(recentOrders as RecentOrderType[]);
    })();
  }, []);
  console.log(recentOrder)

  return (
    <div className="flex flex-col px-2 py-4 w-full h-full  lg:max-w-[600px]">
      <div className="flex items-center justify-between pb-7">
        <h2 className="text-2xl tracking-wide text-nowrap">Recent Orders</h2>
        <p className="flex items-center justify-center text-[12px] cursor-pointer hover:underline text-[var(--primary-color)] flex-nowrap">
          <span className="text-nowrap" onClick={() => setUrl("order-list")}>
            View More
          </span>
          <ChevronRight size={15} />
        </p>
      </div>
      <div
        className={`duration-200 max-h-[550px] overflow-y-scroll
         `}
      >
        <div className="flex flex-col items-center justify-center gap-2 py-2 scroll-smooth ">
          {recentOrder?.map((order, index) => (
            <OrderCard
              image={order.image}
              orderId={order.orderId}
              price={order.price}
              orderRequest={order.orderRequest}
              products={order.products}
              status={order.status}
              key={index}
            />
          ))}
        </div>
      </div>
      {url && <Loader url={`${url}/`} />}
    </div>
  );
};